import React, { createContext, useState, useEffect, useMemo, useContext, useRef } from 'react';
import axios from 'axios';
import Config from 'react-native-config';

import StompJs, { Client } from '@stomp/stompjs';
import { AuthContext } from './auth-context';
import { binaryBodyToString } from '../util/binaryBodyToString';
import { ChatContext } from './chat-context';
import { ChatProps } from '../components/chat/Chat';
import { v4 as uuidv4 } from 'uuid';
import { UserContext } from './user-context';
import { createAlertMessage } from '../util/alert';
import { parseDateString } from '../util/parseTime';
import { AppState, AppStateStatus } from 'react-native';
import { loadCache, saveCache } from '../util/encryptedStorage';
import { formatISOStringNoMillis } from '../util/formatTime';

const LOCALHOST = Config.LOCALHOST;
const SOCKET_URL = Config.SOCKET_URL;

interface ChatRoomContextType {
  websocket: StompJs.Client | null,
  sentHeartIds: number[],
  receivedHeartIds: number[],
  chatRooms: { [roomId: number]: ChatRoom },
  status: string,
  getChatRoomList: () => void;
  sendHeart: (roomId: number) => void,
  acceptHeart: (roomId: number) => void,
  rejectHeart: (roomId: number) => void,
  leftRoom: (roomId: number) => void,
  fetchChat: (roomId: number, sendTime: Date) => void,
  sendChat: (roomId: number, message: string) => void,
}

export const ChatRoomContext = createContext<ChatRoomContextType>({
  websocket: null,
  sentHeartIds: [],
  receivedHeartIds: [],
  chatRooms: {},
  status: '',
  getChatRoomList: () => {},
  sendHeart: (roomId: number) => {},
  acceptHeart: (roomId: number) => {},
  rejectHeart: (roomId: number) => {},
  leftRoom: (roomId: number) => {},
  fetchChat: (roomId: number, sendTime: Date) => {},
  sendChat: (roomId: number, message: string) => {},
});

interface ChatRoomProviderProps {
  children: React.ReactNode;
}

export interface ChatRoom {
  createdAt: Date,
  updatedAt: Date,
  roomId: number,
  status: string,
  public: boolean,
  senderId: number,
  senderNickname: string,
  senderGeneratedS3url: string,
  senderOriginS3url: string,
  type: string,
  content: string,
}

interface ChatRoomListItem {
  memberId: number,
  memberNickname: string,
  memberGeneratedS3url: string,
  memberOriginS3url: string,
  senderId: number,
  senderNickname: string,
  senderGeneratedFaceS3url: string,
  senderOriginFaceS3url: string,
  chatRoom: { 
    createdAt: Date,
    updatedAt: Date,
    id: number,
    status: string,
    public: boolean,
  },
  isSender?: boolean,
  content?: string,
  message?: string,
}

interface ChatRoomResponse {
  chatRoomHeartList: ChatRoomListItem[], 
  chatRoomOpenList: ChatRoomListItem[], 
  chatRoomMessageList: ChatRoomListItem[], 
  chatRoomCloseList: ChatRoomListItem[],
}

interface ReceiveChat {
  method: "receiveChat",
  roomId: number,
  senderId: number,
  receiveId: number,
  senderNickname: string,
  senderFaceInfoS3Url: string,
  type: string,
  content: string,
  sendTime: string,
  isRead: boolean,
}

interface ReceiveHeart extends ChatRoomListItem{
  senderName: string,
}

interface ReceiveHeartResponse {
  method: "receiveHeartResponse",
  senderId: number,
  intention: "positive" | "negative",
}

interface FetchedChat {
  content: string,
  sendTime: string,
  senderId: number,
  senderNickname: string,
  senderOriginS3Url: string,
  senderGeneratedS3Url: string;
}

const ChatRoomContextProvider: React.FC<ChatRoomProviderProps> = ({ children }) => {

  const [websocket, setWebsocket] = useState<StompJs.Client | null>(null);
  const [chatRooms, setChatRooms] = useState<{ [roomId: number]: ChatRoom }>({});
  const [sentHeartIds, setSentHeartIds] = useState<number[]>([]);
  const [receivedHeartIds, setReceivedHeartIds] = useState<number[]>([]);

  const [subscription, setSubscription] = useState<StompJs.StompSubscription | null>(null);
  const [status, setStatus] = useState('');

  const authCtx = useContext(AuthContext);
  const userCtx = useContext(UserContext);
  const chatCtx = useContext(ChatContext);

  const getChatRoomList = async () => {
    try {
      console.log('getChatRoomList');
      const endpoint = `${LOCALHOST}/room/list`;
      const config = { 
        headers: { Authorization: 'Bearer ' + authCtx.accessToken } 
      };
      const response = await axios.get(endpoint, config);
      const { chatRoomHeartList, chatRoomOpenList, chatRoomMessageList, chatRoomCloseList }: ChatRoomResponse = response.data;
      
      if (chatRoomHeartList) {
        chatRoomHeartList.map(chatRoomListItem => {
          if (chatRoomListItem.isSender) {
            setSentHeartIds(prevIds => [...prevIds, chatRoomListItem.senderId ?? 0]);
          } 
          const newChatRoom: ChatRoom = {
            createdAt: chatRoomListItem.chatRoom.createdAt,
            updatedAt: chatRoomListItem.chatRoom.updatedAt,
            roomId: chatRoomListItem.chatRoom.id,
            status: chatRoomListItem.chatRoom.status,
            public: chatRoomListItem.chatRoom.public,
            senderId: chatRoomListItem.senderId,
            senderNickname: chatRoomListItem.senderNickname,
            senderGeneratedS3url: chatRoomListItem.senderGeneratedFaceS3url,
            senderOriginS3url: chatRoomListItem.senderOriginFaceS3url,
            type: `${chatRoomListItem.isSender ? 'SENT' : 'RECEIVED'}_HEART`,
            content: chatRoomListItem.isSender ? '하트를 보냈습니다.' : '하트를 받았습니다.',
          }
          setChatRooms(prevChatRooms => ({
            ...prevChatRooms,
            [newChatRoom.roomId]: newChatRoom,
          }));
        });
      }
      
      if (chatRoomOpenList) {
        chatRoomOpenList.map(chatRoomListItem => {
          const newChatRoom: ChatRoom = {
            createdAt: chatRoomListItem.chatRoom.createdAt,
            updatedAt: chatRoomListItem.chatRoom.updatedAt,
            roomId: chatRoomListItem.chatRoom.id,
            status: chatRoomListItem.chatRoom.status,
            public: chatRoomListItem.chatRoom.public,
            senderId: chatRoomListItem.senderId,
            senderNickname: chatRoomListItem.senderNickname,
            senderGeneratedS3url: chatRoomListItem.senderGeneratedFaceS3url,
            senderOriginS3url: chatRoomListItem.senderOriginFaceS3url,
            type: 'OPENED',
            content: '',
          }
          setChatRooms(prevChatRooms => ({
            ...prevChatRooms,
            [newChatRoom.roomId]: newChatRoom,
          }));
        });
      }

      if (chatRoomMessageList) {
        chatRoomMessageList.map(chatRoomListItem => {
          const newChatRoom: ChatRoom = {
            createdAt: chatRoomListItem.chatRoom.createdAt,
            updatedAt: chatRoomListItem.chatRoom.updatedAt,
            roomId: chatRoomListItem.chatRoom.id,
            status: chatRoomListItem.chatRoom.status,
            public: chatRoomListItem.chatRoom.public,
            senderId: chatRoomListItem.senderId,
            senderNickname: chatRoomListItem.senderNickname,
            senderGeneratedS3url: chatRoomListItem.senderGeneratedFaceS3url,
            senderOriginS3url: chatRoomListItem.senderOriginFaceS3url,
            type: 'OPENED',
            content: chatRoomListItem.content ?? '',
          };
          setChatRooms(prevChatRooms => ({
            ...prevChatRooms,
            [newChatRoom.roomId]: newChatRoom,
          }));
        });
      }

      if (chatRoomCloseList) {
        chatRoomCloseList.map(chatRoomListItem => {
          const newChatRoom: ChatRoom = {
            createdAt: chatRoomListItem.chatRoom.createdAt,
            updatedAt: chatRoomListItem.chatRoom.updatedAt,
            roomId: chatRoomListItem.chatRoom.id,
            status: chatRoomListItem.chatRoom.status,
            public: chatRoomListItem.chatRoom.public,
            senderId: 0,
            senderNickname: '(알 수 없음)',
            senderGeneratedS3url: '',
            senderOriginS3url: '',
            type: 'CLOSED',
            content: '',
          };
          setChatRooms(prevChatRooms => ({
            ...prevChatRooms,
            [newChatRoom.roomId]: newChatRoom,
          }));
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const leftRoom = async (roomId: number) => {
    const method = "leftRoom";
    const endpoint = `${LOCALHOST}/room/${roomId}/left`;
    const config = { 
      headers: { Authorization: 'Bearer ' + authCtx.accessToken } 
    };
    try {
      const response = await axios.post(endpoint, config);
      console.log(response.data);
    } catch (error) {
      console.log(method, error);
    }
  }

  const fetchChat = async (roomId: number, sendTime: Date) => {
    const method = "fetchChat";
    const endpoint = `${LOCALHOST}/chat/${roomId}/messages`;
    const body = { sendTime: formatISOStringNoMillis(sendTime) };
    const config = { 
      headers: { Authorization: 'Bearer ' + authCtx.accessToken } 
    };
    try {
      const response = await axios.post(endpoint, body, config);
      if (response.status === 200) {
        console.log('fetchChat:', response.data);
        const newChats = response.data.map((chat: FetchedChat) => {
          const newChat: ChatProps = {
            id: uuidv4(),
            senderId: chat.senderId,
            sendTime: new Date(chat.sendTime),
            senderNickname: chat.senderNickname,
            senderGeneratedFaceS3url: chat.senderGeneratedS3Url,
            senderOriginFaceS3url: chat.senderOriginS3Url,
            content: chat.content,
          }
          return newChat;
        })
        chatCtx.prependChats(roomId, newChats);
      } 
      else {
        throw new Error(response.statusText);
      }
    } catch(error) {
      console.log(method, error);
    }
  }

  const sendChat = (roomId: number, message: string) => {
    if (!websocket?.connected) return;
    websocket?.publish({
      destination: '/pub/chat/messages',
      headers: { Authorization: "Bearer " + authCtx.accessToken },
      body: JSON.stringify({ 
        roomId: roomId.toString(), 
        receiveId: chatRooms[roomId].senderId.toString(), 
        content: message 
      })
    });
    // const newChat: ChatProps = {
    //   id: uuidv4(),
    //   senderId: authCtx.userId,
    //   senderNickname: userCtx.basicinfo.nickname,
    //   senderGeneratedFaceS3url: userCtx.faceinfo.generatedS3url,
    //   senderOriginFaceS3url: userCtx.faceinfo.originS3url,
    //   content: message,
    //   sendTime: new Date(),
    // }
    // chatCtx.addChat(roomId, newChat);
    // const newChatRoom: ChatRoom = { ...chatRooms[roomId], updatedAt: new Date() };
    // setChatRooms(prevChatRooms => ({
    //   ...prevChatRooms,
    //   [roomId]: newChatRoom,
    // }));
  }

  const sendHeart = (receiveId: number) => {
    websocket?.publish({
      destination: '/pub/chat/send-heart',
      headers: { Authorization: "Bearer " + authCtx.accessToken },
      body: JSON.stringify({ receiveId: receiveId.toString() })
    });
    setSentHeartIds(prevIds => [...prevIds, receiveId]);
  }

  const receiveHeart = (chatRoomListItem: ReceiveHeart) => {
    // createAlertMessage("receiveHeart");
    const newChatRoom: ChatRoom = {
      createdAt: chatRoomListItem.chatRoom.createdAt,
      updatedAt: chatRoomListItem.chatRoom.updatedAt,
      roomId: chatRoomListItem.chatRoom.id,
      status: chatRoomListItem.chatRoom.status,
      public: chatRoomListItem.chatRoom.public,
      senderId: chatRoomListItem.senderId,
      senderNickname: chatRoomListItem.senderName,
      senderGeneratedS3url: chatRoomListItem.senderGeneratedFaceS3url,
      senderOriginS3url: chatRoomListItem.senderOriginFaceS3url,
      type: 'RECEIVED_HEART',
      content: '하트를 받았습니다.',
    }
    setReceivedHeartIds(prevIds => [...prevIds, chatRoomListItem.senderId]);
    setChatRooms(prevChatRooms => ({
      ...prevChatRooms,
      [newChatRoom.roomId]: newChatRoom,
    }));
  }

  const sendHeartResponse = () => {
    // createAlertMessage("sendHeartResponse");
    getChatRoomList();
  }

  const receiveHeartResponse = (receiveHeartResponse: ReceiveHeartResponse) => {
    // createAlertMessage(JSON.stringify(receiveHeartResponse));
    if (receiveHeartResponse.intention === 'negative') {
      sentHeartIds.filter(id => id !== receiveHeartResponse.senderId);
    }
    else {
      getChatRoomList();
    }
  }

  const acceptHeart = (roomId: number) => {
    console.log("accecptHeart", roomId);
    websocket?.publish({
      destination: '/pub/chat/heart-reply',
      headers: { Authorization: "Bearer " + authCtx.accessToken },
      body: JSON.stringify({ senderId: chatRooms[roomId].senderId.toString(), intention: "positive" })
    });
    const newChatRoom: ChatRoom = { ...chatRooms[roomId], type: 'OPENED', updatedAt: new Date() };
    setChatRooms(prevChatRooms => ({
      ...prevChatRooms,
      [roomId]: newChatRoom,
    }));
  }

  const rejectHeart = (roomId: number) => {
    console.log("roomId:", roomId);
    console.log(chatRooms[roomId].senderId);

    websocket?.publish({
      destination: '/pub/chat/heart-reply',
      headers: { Authorization: "Bearer " + authCtx.accessToken },
      body: JSON.stringify({ senderId: chatRooms[roomId].senderId.toString(), intention: "negative" })
    });
    setChatRooms((prevChatRooms) => {
      const { [roomId]: _, ...remainingChatRooms } = prevChatRooms;
      return remainingChatRooms;
    });
  }

  const receiveChat = (receiveChat: ReceiveChat) => {
    console.log("@@@@@@@@@@@@@@ receiveChat @@@@@@@@@@@@@");
    console.log(receiveChat);
    const newChat: ChatProps = {
      id: uuidv4(),
      senderId: receiveChat.senderId,
      senderNickname: receiveChat.senderNickname,
      senderGeneratedFaceS3url: receiveChat.senderFaceInfoS3Url,
      senderOriginFaceS3url: receiveChat.senderFaceInfoS3Url,
      sendTime: parseDateString(receiveChat.sendTime),
      content: receiveChat.content,
    }
    chatCtx.addChat(receiveChat.roomId, newChat);
  }

  const getRoomIdBySenderId = (senderId: number): number => {
    for (const key in chatRooms) {
      if (chatRooms[key].senderId === senderId) {
        return chatRooms[key].roomId;
      }
    }
    return 0;
  };

  interface ConnectChatResponse {
    method: 'connectChat',
    roomId: number,
    senderId: number,
    receiveId: number,
    senderNickname: string,
    senderFaceInfoS3Url: string,
    type: string,
    content: string,
    sendTime: string,
    isRead: boolean,
  }

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [chatBuffer, setChatBuffer] = useState<ChatProps[]>([]);
  const chatBufferRef = useRef<ChatProps[]>(chatBuffer);

  const connectChat = (connectChatResponse: ConnectChatResponse) => {
    console.log("@@@@@@@@@@@@@connectChat", connectChatResponse.content);
    const newChat: ChatProps = {
      id: uuidv4(),
      senderId: connectChatResponse.senderId,
      senderNickname: connectChatResponse.senderNickname,
      senderGeneratedFaceS3url: connectChatResponse.senderFaceInfoS3Url,
      senderOriginFaceS3url: connectChatResponse.senderFaceInfoS3Url,
      sendTime: parseDateString(connectChatResponse.sendTime),
      content: connectChatResponse.content,
    };
    setChatBuffer(prev => [...prev, newChat]);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      console.log("@@@@@@@@chatBuffer:", chatBufferRef.current);
      chatBufferRef.current.map((chat) => {
        const roomId = getRoomIdBySenderId(chat.senderId);
        chatCtx.addChat(roomId, chat);
      });
      setChatBuffer([]);
    }, 1000);
  };

  const initializeClient = () => {
    setStatus('INITIALIZE');
    const stompClient = new Client({
      brokerURL: SOCKET_URL, 
      reconnectDelay: 5000,
      connectHeaders: { Authorization: "Bearer " + authCtx.accessToken },
      debug: (msg) => {
        console.log('debug:', msg) 
      },
      forceBinaryWSFrames: true,
      appendMissingNULLonIncoming: true,
      onConnect: async () => {
        console.log('onConnect');
        setStatus('INITIALIZED');
        
        const userId = await loadCache('userId');
        authCtx.setUserId(userId);
        
        const subscriptionPromise = new Promise((resolve, reject) => {
          const subscription = subscribe(stompClient);
          // 구독 성공 시 resolve 호출
          if (subscription) {
            resolve(subscription);
          } else {
            reject(new Error('Subscription failed'));
          }
        });
      
        // 구독 성공 후 메시지 전송
        subscriptionPromise.then(() => {
          sendConnect(stompClient);
        }).catch((error) => {
          console.error('Subscription error:', error);
        });
      },
      onDisconnect: () => {
        unsubscribe(stompClient, subscription?.id ?? '0');
        postDisconnect();
      }
    });

    setWebsocket(stompClient);
    stompClient.activate();
  }

  const handleSocketResponse = (message: StompJs.IMessage) => {
    const { binaryBody, ...response } = message;
    // console.log("\n\n\n\n\n", JSON.stringify(response));
    console.log("\nbinarybody:", binaryBodyToString(binaryBody));

    if (binaryBodyToString(binaryBody) === "저장 성공") {
      console.log("connectResponse");
      setStatus('CONNECTED')
      // createAlertMessage('CONNECTED');
      return;
    }
    if (binaryBodyToString(binaryBody) === "성공") {
      setStatus('DISCONNECTED');
      // createAlertMessage('DISCONNECTED');
      return;
    }
    if (binaryBodyToString(binaryBody) === "대화 요청 성공") {
      console.log("sendHeartResponse");
      // createAlertMessage('sendHeartResponse');
      sendHeartResponse();
      return;
    }

    // createAlertMessage(binaryBodyToString(binaryBody));

    const responseData = JSON.parse(binaryBodyToString(binaryBody));
    if (responseData.method === "receiveHeart") {
      console.log("receiveHeart");
      receiveHeart(responseData);
    }
    if (responseData.method === "receiveChat") {
      console.log("receiveChat");
      receiveChat(responseData);
    }
    if (responseData.method === "receiveHeartResponse") {
      console.log("receiveHeartResponse")
      receiveHeartResponse(responseData);
    }
    if (responseData.method === 'connectChat') {
      console.log("connectChat")
      connectChat(responseData);
    }
    // TODO: 
    // receiveLeft
  }

  const subscribe = (stompClient: StompJs.Client) => {
    const path = `/sub/chat/${authCtx.userId}`;

    const newSubscription = stompClient.subscribe(path, (message) => {
      handleSocketResponse(message);
    });

    setStatus('SUBSCRIBED')
    // createAlertMessage('subscribed at ' + path);
    setSubscription(newSubscription);
    return newSubscription;
  }

  const sendConnect = (stompClient: StompJs.Client) => {
    setStatus('CONNECT')
    stompClient?.publish({
      destination: '/pub/stomp/connect',
      headers: { Authorization: "Bearer " + authCtx.accessToken },
    })
  }

  const postDisconnect = async () => {
    if (authCtx.status !== 'INITIALIZED') return;
    const method = 'disconnect: ' + authCtx.accessToken + '\n';
    const endpoint = `${LOCALHOST}/stomp/disconnect`;
    const config = { 
      headers: { Authorization: 'Bearer ' + authCtx.accessToken } 
    };
    try {
      setStatus('DISCONNECT');
      const response = await axios.post(endpoint, null, config);
      console.log(method, response.data);
    }
    catch (error) {
      console.log(method, error);
    }
  }

  const unsubscribe = (stompClient: StompJs.Client, id: string) => {
    stompClient.unsubscribe(id);
    setSubscription(null);
    setStatus('UNSUBSCRIBED');
  }

  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);
  const prevAppState = useRef<AppStateStatus>(appState);
  
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => { 
      console.log('handleAppStateChange:', prevAppState.current, '->', nextAppState, status);
      if (websocket === null) {
        console.log('websocket === null');
        return;
      }
      if (nextAppState === 'active') {
        websocket.activate();
      }
      if (nextAppState === 'background') {
        websocket.deactivate();
      }
      prevAppState.current = nextAppState;
      setAppState(nextAppState); 
    }
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      if (subscription) subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (authCtx.userId === 0) return;
    saveCache('userId', authCtx.userId);
  }, [authCtx.userId]);

  useEffect(() => {
    saveCache(`${authCtx.userId}-sentHeartIds`, JSON.stringify(sentHeartIds));
  }, [sentHeartIds])

  useEffect(() => {
    if (authCtx.status === 'INITIALIZED') {
      initializeClient();
      getChatRoomList();
    }
  }, [authCtx.status]);

  useEffect(() => {
    return (() => {
      websocket?.deactivate();
      postDisconnect();
    })
  }, [])

  useEffect(() => {
    chatBufferRef.current = chatBuffer;
  }, [chatBuffer]);

  useEffect(() => {
    console.log("subscription:", subscription);
  }, [subscription])

  useEffect(() => {
    console.log('@@@@@@@@@@@@@@@ chatRoomCtx.status:', status, '@@@@@@@@@@@@@@@');
  }, [status]);

  const value = useMemo(() => ({
    websocket,
    sentHeartIds,
    receivedHeartIds,
    chatRooms,
    status,
    getChatRoomList,
    sendHeart,
    acceptHeart,
    rejectHeart,
    leftRoom,
    fetchChat,
    sendChat,
  }), [websocket, chatRooms, sentHeartIds, status]);

  return <ChatRoomContext.Provider value={value}>{children}</ChatRoomContext.Provider>;
};

export default ChatRoomContextProvider;

