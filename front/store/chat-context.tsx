import React, { createContext, useState, useEffect, useMemo} from 'react';
import { saveChatHistory, loadChatHistory } from '../util/encryptedStorage';
import Config from 'react-native-config';

import { io } from 'socket.io-client';
import { ChatProps } from '../components/chat/Chat';
import { errorResponse, validResponse } from '../util/auth';
import axios from 'axios';

const SOCKET_URL = Config.SOCKET_URL;
const UUID = "0";

interface ChatContextType {
  chats: ChatProps[];
  setChats: (chats: ChatProps[]) => void;
  addChat: (chat: ChatProps) => void;
  fetchChatHistory: (page: number) => Promise<ChatProps[] | undefined>;
  handleSaveChatHistory: () => void;
  handleLoadChatHistory: () => void;
}

export const ChatContext = createContext<ChatContextType>({
  chats: [],
  setChats: (chats: ChatProps[]) => {},
  addChat: (chat: ChatProps) => {},
  fetchChatHistory: async () => [],
  handleSaveChatHistory: async () => {},
  handleLoadChatHistory: async () => {},
});

interface ChatProviderProps {
  children: React.ReactNode;
}

const ChatContextProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [chats, setChats] = useState<ChatProps[]>([]);
  const [sendingChat, setSendingChat] = useState<ChatProps | null>(null);

  const areDatesEqual = (date1: Date | string | undefined, date2: Date | string | undefined) => {
    console.log("date1:", date1, "date2:", date2);

    // date1과 date2가 문자열이라면 Date 객체로 변환
    const d1 = (typeof date1 === 'string' || date1 instanceof Date) ? new Date(date1) : date1;
    const d2 = (typeof date2 === 'string' || date2 instanceof Date) ? new Date(date2) : date2;

    // date1 또는 date2가 유효하지 않은 경우
    if (d1 === undefined || d2 === undefined || isNaN(d1.getTime()) || isNaN(d2.getTime())) {
        return false; // 날짜 데이터가 없거나 유효하지 않으면 같지 않다고 처리
    }

    // 연, 월, 일, 시, 분이 같은지 확인
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate() &&
      d1.getHours() === d2.getHours() &&
      d1.getMinutes() === d2.getMinutes()
    );
  }

  const getIsSequenceChat = (prevChat: ChatProps | undefined, newChat: ChatProps) => {
    if (prevChat === undefined) return false;
    return areDatesEqual(prevChat?.timestamp, newChat?.timestamp) && prevChat?.uuid == UUID;
  }

  const addChat = (chat: ChatProps) => {
    if (chats.length) {
      const prevChat = chats[chats.length - 1];
      const isSequence = getIsSequenceChat(prevChat, chat);
      const newPrevChat = {...prevChat, isFinal: !isSequence };
      const newChat = {...chat, isInitial: !isSequence, isFinal: true};
      console.log("addChat:", prevChat.isInitial, prevChat.isFinal, newChat.isInitial, newChat.isFinal);
      setChats([...chats.slice(0, -1), newPrevChat, newChat]);
    }
    else {
      setChats([{...chat, isInitial: true, isFinal: true}]);
    }
  }

  const fetchChatHistory = async (page: number) => {
    const method = "fetchChatHistory";
    const endpoint = `https://swapi.py4e.com/api/people/?page=${page % 5 + 1}`;

    try {
      const response = await axios.get(endpoint);
      const chats: ChatProps[] = response.data.results.map((result: { name: string, birth_year: string, created: string }, index: number) => {
        const prevResult = index ? response.data.results[index - 1] : undefined;
        const nextResult = response.data.results[index + 1];
        const newChat = { 
          message: result.name, 
          nickname: `page${page}`,
          uuid: `page${page}`, 
          id: result.created + page, 
          timestamp: new Date(0),
          isInitial: prevResult ? false : true,
          isFinal: nextResult ? false : true,
        };
        return newChat;
      });
      return chats;
    } catch (error) {
      console.error('fetchChatHistory:', error);
    }
  }
  
  const handleSaveChatHistory = async () => {
    saveChatHistory(chats);
  }

  const handleLoadChatHistory = async () => {
    const chatHistory = await loadChatHistory();
    console.log(chatHistory);
    setChats(chatHistory ? chatHistory as ChatProps[] : []);
  }

  useEffect(() => {
    const loadChat = async () => { 
      try { 
          console.log("채팅 로딩 시도");
          await handleLoadChatHistory();
          console.log("채팅 로딩 성공");
      } catch (error) { 
          console.error('채팅 로딩 실패:', error); 
      } 
    }
    loadChat();
  }, [])

  useEffect(() => {
    if (SOCKET_URL) {
      const socket = io(SOCKET_URL, {
        transports: ['websocket'], 
      });
  
      console.log('소켓 통신 연결 시작');
      socket.on('connect', () => {
        console.log('소켓 통신 연결됨');
      });
  
      socket.on('message', (newChat: ChatProps) => {
        console.log('New chat:', newChat.message);
        setChats([...chats, newChat]);
      });
  
      if (sendingChat) {
        const sendingData = { message: sendingChat.message, timestamp: sendingChat.timestamp, userId: sendingChat.uuid };
        console.log(sendingData);
        socket.emit('message', JSON.stringify(sendingData), setSendingChat(null));
      }
      
      return () => {
        socket.disconnect();
      };
    }
  }, [sendingChat]);
  
  const value = useMemo(() => ({
    chats,
    setChats,
    addChat,
    fetchChatHistory,
    handleSaveChatHistory,
    handleLoadChatHistory,
  }), [chats]);

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export default ChatContextProvider;

