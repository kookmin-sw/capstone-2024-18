import React, { createContext, useState, useEffect, useMemo, useContext} from 'react';
import { saveData, loadData } from '../util/encryptedStorage';
import { ChatProps } from '../components/chat/Chat';
import { AuthContext } from './auth-context';
import { AppState, AppStateStatus } from 'react-native';
import { getIsDailyInitial, getIsFinal, getIsInitial } from '../util/getChatSequentialStatus';

export type Chats = { [roomId: number]: ChatProps[] };

interface ChatContextType {
  chats: Chats;
  setChats: (chats: { [roomId: number]: ChatProps[] }) => void;
  addChat: (roomId: number, chat: ChatProps) => void;
  prependChats: (roomId: number, newChats: ChatProps[]) => void;
  appendChats: (roomId: number, newChats: ChatProps[]) => void;
  handleSaveChatHistory: (userId: number) => void;
  handleLoadChatHistory: (userId: number) => void;
}

export const ChatContext = createContext<ChatContextType>({
  chats: [],
  setChats: ({}) => {},
  addChat: (roomId: number, chat: ChatProps) => {},
  prependChats: (roomId: number, newChats: ChatProps[]) => {},
  appendChats: (roomId: number, newChats: ChatProps[]) => {},
  handleSaveChatHistory: async (userId: number) => {},
  handleLoadChatHistory: async (userId: number) => {},
});

interface ChatProviderProps {
  children: React.ReactNode;
}

const ChatContextProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [chats, setChats] = useState<{[roomId: number]: ChatProps[]}>({});

  const authCtx = useContext(AuthContext);

  const addChat = (roomId: number, chat: ChatProps) => {
    setChats((prevChats) => { 
      const currChats = roomId in prevChats ? prevChats[roomId] : [];
      const prevChat = currChats.length ? currChats[currChats.length - 1] : undefined;
      const newPrevChat = prevChat ? {...prevChat, isFinal: getIsFinal(prevChat, chat) } : undefined;
      const newChat = {...chat, isDailyInitial: getIsDailyInitial(prevChat, chat), isInitial: getIsInitial(prevChat, chat), isFinal: true};
        
      return { 
        ...prevChats,
        [roomId]: [
          ...currChats.slice(0, -1),
          ...(newPrevChat ? [newPrevChat] : []),
          newChat
        ]
      };
    });
  }

  const prependChats = (roomId: number, newChats: ChatProps[]) => {
    setChats((prevChats) => {
      const annotatedChats = newChats.map((chat: ChatProps, index) => {
        const prevChat = index ? newChats[index - 1] : undefined;
        const nextChat = index === newChats.length ? prevChats[roomId][0] : newChats[index + 1];
        const isDailyInitial = getIsDailyInitial(prevChat, chat);
        const isInitial = getIsInitial(prevChat, chat);
        const isFinal = getIsFinal(chat, nextChat);
        return { ...chat, isDailyInitial, isInitial, isFinal };
      });

      const safePrevChats = prevChats ?? [];
      const currChats = roomId in safePrevChats ? safePrevChats[roomId] : [];
      return { ...safePrevChats, [roomId]: [ ...annotatedChats, ...currChats ]};
    });
  }

  const appendChats = (roomId: number, newChats: ChatProps[]) => {
    console.log("prependChats");
    setChats((prevChats) => {
      const annotatedChats = newChats.map((chat: ChatProps, index) => {
        const safePrevChats: ChatProps[] = (prevChats ?? {})[roomId] ?? [];
        const prevChat = index ? newChats[index - 1]: safePrevChats[0];
        console.log(prevChat);
        const nextChat = index === newChats.length ? undefined : newChats[index + 1];
        const isDailyInitial = getIsDailyInitial(prevChat, chat);
        const isInitial = getIsInitial(prevChat, chat);
        const isFinal = getIsFinal(chat, nextChat);
        return { ...chat, isDailyInitial, isInitial, isFinal };
      });

      const safePrevChats = prevChats ?? [];
      const currChats = roomId in safePrevChats ? safePrevChats[roomId] : [];
      return { ...safePrevChats, [roomId]: [ ...currChats, ...annotatedChats ]};
    });
  }
  
  const handleSaveChatHistory = async (userId: number) => {
    try {
      console.log("채팅 저장 시도");
      await saveData(userId, { chats });
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
      setChats(chats ?? {});
    } catch (error) {
      console.error('채팅 로딩 실패:', error); 
    }
  }

  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (
        appState.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('포그라운드 전환');
      } else if (nextAppState === 'background') {
        handleSaveChatHistory(authCtx.userId);
        console.log('백그라운드 전환');
      } else if (nextAppState === 'inactive') {
        handleSaveChatHistory(authCtx.userId);
        console.log('앱 종료');
      }
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [appState]);

  const value = useMemo(() => ({
    chats,
    setChats,
    addChat,
    prependChats,
    appendChats,
    handleSaveChatHistory,
    handleLoadChatHistory,
  }), [chats]);

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export default ChatContextProvider;

