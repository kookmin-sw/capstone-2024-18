import React, { createContext, useState, useEffect, useMemo, useContext} from 'react';
import { saveData, loadData, saveChatHistory, loadChatHistory } from '../util/encryptedStorage';
import { ChatProps } from '../components/chat/Chat';
import { AuthContext } from './auth-context';
import { AppState, AppStateStatus } from 'react-native';
import { getIsDailyInitial, getIsFinal, getIsInitial } from '../util/getChatSequentialStatus';

export type Chats = { [roomId: number]: ChatProps[] };

interface ChatContextType {
  chats: Chats;
  status: string,
  setChats: (chats: { [roomId: number]: ChatProps[] }) => void;
  addChat: (roomId: number, chat: ChatProps) => void;
  prependChats: (roomId: number, newChats: ChatProps[]) => void;
  appendChats: (roomId: number, newChats: ChatProps[]) => void;
}

export const ChatContext = createContext<ChatContextType>({
  chats: [],
  status: '',
  setChats: ({}) => {},
  addChat: (roomId: number, chat: ChatProps) => {},
  prependChats: (roomId: number, newChats: ChatProps[]) => {},
  appendChats: (roomId: number, newChats: ChatProps[]) => {},
});

interface ChatProviderProps {
  children: React.ReactNode;
}

const ChatContextProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [chats, setChats] = useState<{[roomId: number]: ChatProps[]}>({});
  const [status, setStatus] = useState('');
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);

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

      if (annotatedChats.length === 0) {
        return prevChats;
      }

      const safePrevChats = prevChats ?? [];
      const currChats = roomId in safePrevChats ? safePrevChats[roomId] : [];
      const currFirstChat: ChatProps = { 
        ...currChats[0], 
        isDailyInitial: getIsDailyInitial(annotatedChats[annotatedChats.length - 1], currChats[0]),
        isInitial: getIsInitial(annotatedChats[annotatedChats.length - 1], currChats[0]),
      }
      return { ...safePrevChats, [roomId]: [ ...annotatedChats, currFirstChat, ...currChats.slice(1) ]};
    });
  }

  const appendChats = (roomId: number, newChats: ChatProps[]) => {
    setChats((prevChats) => {
      const annotatedChats = newChats.map((chat: ChatProps, index) => {
        const safePrevChats: ChatProps[] = (prevChats ?? {})[roomId] ?? [];
        const prevChat = index ? newChats[index - 1]: safePrevChats[0];
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
  
  useEffect(() => {
    const loadInitialChat = async () => {
      if (authCtx.status !== 'INITIALIZED') return;
      console.log("loadInitialChat 시작");
      const chats = await loadChatHistory(authCtx.userId);
      setChats(chats ?? {});
      setStatus('LOADED'); 
      console.log("loadInitialChat 종료");
    };
    loadInitialChat();
  }, [authCtx.status]);

  useEffect(() => {
    console.log('chat-context:', status);
  }, [status])

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        console.log('포그라운드 전환');
      } else if (nextAppState === 'background' || nextAppState === 'inactive') {
        saveChatHistory(chats, authCtx.userId);
        console.log(nextAppState === 'background' ? '백그라운드 전환' : '앱 종료');
      }
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      saveChatHistory(chats, authCtx.userId);
      if (subscription) {
        subscription.remove();
      }
    };
  }, [chats, authCtx.userId]);

  const value = useMemo(() => ({
    chats,
    status,
    setChats,
    addChat,
    prependChats,
    appendChats,
  }), [chats, status]);

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export default ChatContextProvider;

