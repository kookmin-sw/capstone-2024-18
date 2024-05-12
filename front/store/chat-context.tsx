import React, { createContext, useState, useEffect, useMemo, useContext} from 'react';
import { saveData, loadData } from '../util/encryptedStorage';
import { ChatProps } from '../components/chat/Chat';
import { AuthContext } from './auth-context';
import { areMinutesEqual, areDatesEqual } from '../util/dateTimeUtils';

interface ChatContextType {
  chats: { [roomId: number]: ChatProps[] };
  setChats: (chats: { [roomId: number]: ChatProps[] }) => void;
  addChat: (userId: number, chat: ChatProps) => void;
  handleSaveChatHistory: (userId: number) => void;
  handleLoadChatHistory: (userId: number) => void;
}

export const ChatContext = createContext<ChatContextType>({
  chats: [],
  setChats: ({}) => {},
  addChat: (userId: number, chat: ChatProps) => {},
  handleSaveChatHistory: async (userId: number) => {},
  handleLoadChatHistory: async (userId: number) => {},
});

interface ChatProviderProps {
  children: React.ReactNode;
}

const ChatContextProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [chats, setChats] = useState<{[roomId: number]: ChatProps[]}>({});

  const authCtx = useContext(AuthContext);

  const getIsDailyInitial = (prevChat: ChatProps | undefined, chat: ChatProps) => {
    const isInitial = prevChat === undefined || !areDatesEqual(prevChat.sendTime, chat.sendTime);
    return isInitial;
  }

  const getIsInitial = (prevChat: ChatProps | undefined, chat: ChatProps) => {
    const isInitial = prevChat === undefined || !areMinutesEqual(prevChat.sendTime, chat.sendTime);
    return isInitial;
  }

  const getIsFinal = (chat: ChatProps, nextChat: ChatProps | undefined) => {
    const isFinal = nextChat === undefined || !areMinutesEqual(nextChat.sendTime, chat.sendTime);
    return isFinal;
  }

  const addChat = (roomId: number, chat: ChatProps) => {
    const currChats = chats[roomId];
    const prevChat = currChats[currChats.length - 1];
    const newPrevChat = {...prevChat, isFinal: getIsFinal(prevChat, chat) };
    const newChat = {...chat, isDailyInitial: getIsDailyInitial(prevChat, chat), isInitial: getIsInitial(prevChat, chat), isFinal: true};
    setChats((prevChats) => { 
      return { ...prevChats, [roomId]: [...currChats.slice(0, -1), newPrevChat, newChat]} 
    });
  }

  const prependChats = (roomId: number, newChats: ChatProps[]) => {
    const annotatedChats = newChats.map((chat: ChatProps, index) => {
      const prevChat = newChats[index - 1];
      const nextChat = newChats[index + 1] ?? chats[roomId][0];
      const isDailyInitial = getIsDailyInitial(prevChat, chat);
      const isInitial = getIsInitial(prevChat, chat);
      const isFinal = getIsFinal(chat, nextChat);
      return { ...chat, isDailyInitial, isInitial, isFinal };
    });
    setChats((prevChats) => { 
      return { ...prevChats, [roomId]: [ ...annotatedChats, ...prevChats[roomId] ]};
    });
  }

  const appendChats = (roomId: number, newChats: ChatProps[]) => {
    const annotatedChats = newChats.map((chat: ChatProps, index) => {
      const prevChat = newChats[index - 1] ?? chats[roomId][chats[roomId].length - 1];
      const nextChat = newChats[index + 1];
      const isDailyInitial = getIsDailyInitial(prevChat, chat);
      const isInitial = getIsInitial(prevChat, chat);
      const isFinal = getIsFinal(chat, nextChat);
      return { ...chat, isDailyInitial, isInitial, isFinal };
    });
    setChats((prevChats) => { 
      return { ...prevChats, [roomId]: [ ...prevChats[roomId], ...annotatedChats ]};
    });
  }
  
  const handleSaveChatHistory = async (userId: number) => {
    try {
      console.log("채팅 저장 시도");
      await saveData(userId, chats);
      console.log("채팅 저장 성공");
    } catch (error) {
      console.error('채팅 저장 실패:', error); 
    }
  }

  const handleLoadChatHistory = async (userId: number) => {
    try {
      console.log("채팅 로딩 시도");
      const { chats } = await loadData(userId);
      console.log("채팅 로딩 성공");
      console.log(chats);
      setChats(chats);
    } catch (error) {
      console.error('채팅 로딩 실패:', error); 
    }
  }

  useEffect(() => {
    if (authCtx.status !== 'INITIALIZED') return;
    handleLoadChatHistory(authCtx.userId);
    return () => {
      handleSaveChatHistory(authCtx.userId);
    };
  }, [authCtx.status])

  const value = useMemo(() => ({
    chats,
    setChats,
    addChat,
    handleSaveChatHistory,
    handleLoadChatHistory,
  }), [chats]);

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export default ChatContextProvider;

