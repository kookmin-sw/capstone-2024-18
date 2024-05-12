import React, { createContext, useState, useEffect, useMemo, useContext} from 'react';
import { saveChatHistory, loadChatHistory } from '../util/encryptedStorage';
import Config from 'react-native-config';
import StompJs, { Client, IMessage } from '@stomp/stompjs';
import { ChatProps } from '../components/chat/Chat';
import axios from 'axios';
import { AuthContext } from './auth-context';
import { UserContext } from './user-context';

const SOCKET_URL = Config.SOCKET_URL;
const LOCALHOST = Config.LOCALHOST;

interface ChatContextType {
  chats: ChatProps[];
  setChats: (chats: ChatProps[]) => void;
  addChat: (chat: ChatProps) => void;
  fetchChatHistory: (page: number) => Promise<ChatProps[] | undefined>;
  handleSaveChatHistory: () => void;
  handleLoadChatHistory: () => void;
  sendHeart: () => void;
  subscribe: (receiveId: string) => void;
  websocket: StompJs.Client | null;
  receiveId: string;
  setReceiveId: (receiveId: string) => void;
}

export const ChatContext = createContext<ChatContextType>({
  chats: [],
  setChats: (chats: ChatProps[]) => {},
  addChat: (chat: ChatProps) => {},
  fetchChatHistory: async () => [],
  handleSaveChatHistory: async () => {},
  handleLoadChatHistory: async () => {},
  sendHeart: () => {},
  subscribe: (receiveId: string) => {},
  websocket: null,
  receiveId: '',
  setReceiveId: (receiveId: string) => {},
});

interface ChatProviderProps {
  children: React.ReactNode;
}

interface ChatRoomHeartItem {
  sender: string,
  receiver: string,
  chatRoom: { createdAt: string, updatedAt: string, id: number, status: string, public: boolean },
  sendHeart: { senderName: string, senderId: number, receiveId: number, type: string, roomId: number, createdAt: any },
}

interface ChatRoomOpenItem {
  senderId: number,
  senderNickname: string,
  message: string,
}

interface ChatRoomMessageList {
  sender: string,
  receiver: string,
  chatRoom: { createdAt: string, updatedAt: string, id: number, status: string, public: boolean },
  content: string,
  sendTime: string,
  senderNickname: string,
  senderGeneratedFaceInfo: string,
  senderOriginalFaceInfo: string,
}

const ChatContextProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [chats, setChats] = useState<ChatProps[]>([]);
  const [sendingChat, setSendingChat] = useState<ChatProps | null>(null);
  const [websocket, setWebsocket] = useState<StompJs.Client | null>(null);
  const [receiveId, setReceiveId] = useState('');

  const authCtx = useContext(AuthContext);
  const userCtx = useContext(UserContext);

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
    return areDatesEqual(prevChat?.timestamp, newChat?.timestamp) && prevChat?.uuid == authCtx.userId;
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
    if (authCtx.status !== 'INITIALIZED') return;
    const loadChat = async () => { 
      try { 
          console.log("채팅 로딩 시도");
          await handleLoadChatHistory();
          console.log("채팅 로딩 성공");
      } catch (error) { 
          console.error('채팅 로딩 실패:', error); 
      } 
    }
    const getRoomList = async () => {
      const endpoint = `${LOCALHOST}/room/list`;
      const config = { 
        headers: { Authorization: 'Bearer ' + authCtx.accessToken } 
      };
      const response = await axios.get(endpoint, config);
      const { chatRoomHeartList, chatRoomOpenList, charRoomMessageList } = response.data;
      chatRoomHeartList.map((chatRoomHeartItem: ChatRoomHeartItem) => {
        const { sender, receiver, chatRoom, sendHeart } = chatRoomHeartItem;
        setChats(prevChats => {
          return {...prevChats, opponentId: [{
            id: Math.random().toString(), 
            senderId: sender.toString(),
            receiveId: receiver.toString(),
            message: '하트를 보냈습니다.',
            timestamp: new Date(chatRoom.createdAt),
            isHeart: true,
          }]}
        })
      })
    }
    loadChat();
  }, [authCtx.status])

  function binaryBodyToString(binaryBody: object) {
    return String.fromCharCode(...Object.values(binaryBody));
  }

  useEffect(() => {
    if (authCtx.status !== 'INITIALIZED') return;
    // if (!userCtx.status) return;
    const stompClient = new Client({
      brokerURL: "ws://52.79.138.7:8080/ws", 
      reconnectDelay: 5000,
      connectHeaders: {
        Authorization: "Bearer " + authCtx.accessToken,
      },
      debug: (msg) => {
        console.log(msg);
      },
      forceBinaryWSFrames: true,
      appendMissingNULLonIncoming: true,
    });

    stompClient.onConnect = (frame) => {
      console.log("Connected: " + frame);

      // 메시지 구독
      stompClient.subscribe("/sub/chat/4", (message) => {
        console.log(JSON.stringify(message));
        console.log("binarybody:", binaryBodyToString(message.binaryBody));
      });
    };

    stompClient.onStompError = (frame) => {
      console.error("Broker reported error: " + frame.headers["message"]);
      console.error("Additional details: " + frame.body);
    };

    stompClient.activate();
    setWebsocket(stompClient);

    return () => {
      stompClient.deactivate();
    };
  }, [authCtx.status]);

  const sendHeart = () => {
    console.log("sendHeart");
    // 서버로부터 메시지 수신 구독
    try {
      websocket?.publish({
        destination: "/pub/chat/send-heart",
        body: JSON.stringify({ receiveId: "4" }),
        headers: {
          Authorization: "Bearer " + authCtx.accessToken,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
  
  const subscribe = (receiveId: string) => {
    websocket?.subscribe(`/sub/chat/${receiveId}`, (message: IMessage) => {
      console.log('Received: ' + message.body);
    });
  }


  const value = useMemo(() => ({
    chats,
    setChats,
    addChat,
    fetchChatHistory,
    handleSaveChatHistory,
    handleLoadChatHistory,
    sendHeart,
    subscribe,
    websocket,
    receiveId,
    setReceiveId,
  }), [chats]);

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export default ChatContextProvider;

