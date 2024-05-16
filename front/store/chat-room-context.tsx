import React, { createContext, useState, useEffect, useMemo, useContext, useRef} from 'react';
import axios from 'axios';
import Config from 'react-native-config';

import StompJs, { IMessage, Client } from '@stomp/stompjs';
import { AuthContext } from './auth-context';
import { binaryBodyToString } from '../util/binaryBodyToString';
import { ChatContext, Chats } from './chat-context';
import { ChatProps } from '../components/chat/Chat';
import { v4 as uuidv4 } from 'uuid';
import { UserContext } from './user-context';
import { createAlertMessage } from '../util/alert';
import { parseDateString } from '../util/parseTime';
import { AppState, AppStateStatus } from 'react-native';
import { saveChatHistory } from '../util/encryptedStorage';

const LOCALHOST = Config.LOCALHOST;
const SOCKET_URL = Config.SOCKET_URL;

interface ChatRoomContextType {
  websocket: StompJs.Client | null,
  sentHeartIds: number[],
  chatRooms: { [roomId: number]: ChatRoom },
  getChatRoomList: () => void;
  sendHeart: (roomId: number) => void,
  acceptHeart: (roomId: number) => void,
  rejectHeart: (roomId: number) => void,
  leftRoom: (roomId: number) => void,
  fetchChat: (roomId: number, sendTime: Date, pageNo: number) => void,
  sendChat: (roomId: number, message: string) => void,
}

export const ChatRoomContext = createContext<ChatRoomContextType>({
  websocket: null,
  sentHeartIds: [],
  chatRooms: {},
  getChatRoomList: () => {},
  sendHeart: (roomId: number) => {},
  acceptHeart: (roomId: number) => {},
  rejectHeart: (roomId: number) => {},
  leftRoom: (roomId: number) => {},
  fetchChat: (roomId: number, sendTime: Date, pageNo: number) => {},
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

const ChatRoomContextProvider: React.FC<ChatRoomProviderProps> = ({ children }) => {

  const [websocket, setWebsocket] = useState<StompJs.Client | null>(null);
  const [chatRooms, setChatRooms] = useState<{ [roomId: number]: ChatRoom }>({});
  const [sentHeartIds, setSentHeartIds] = useState<number[]>([]);

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
      console.log(response.data);
      const { chatRoomHeartList, chatRoomOpenList, chatRoomMessageList, chatRoomCloseList }: ChatRoomResponse = response.data;
      
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
      const response = await axios.get(endpoint, config);
      console.log(response.data);
    } catch (error) {
      console.log(method, error);
    }
  }

  const fetchChat = async (roomId: number, sendTime: Date) => {
    const method = "fetchChat";
    const endpoint = `${LOCALHOST}/chat/${roomId}/messages`;
    const body = { sendTime: "2024-05-15T13:57:56" };
    const config = { 
      headers: { Authorization: 'Bearer ' + authCtx.accessToken } 
    };
    console.log(body);
    try {
      const response = await axios.post(endpoint, body, config);
      if (response.status === 200) {
        console.log(response.data);
        // TODO
        // chatCtx.prependChats()    
        createAlertMessage(response.data);
        return response;
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
      headers: {
        Authorization: "Bearer " + authCtx.accessToken,
      },
      body: JSON.stringify({ 
        roomId: roomId.toString(), 
        receiveId: chatRooms[roomId].senderId.toString(), 
        content: message 
      })
    });
    const newChat: ChatProps = {
      id: uuidv4(),
      senderId: authCtx.userId,
      senderNickname: userCtx.basicinfo.nickname,
      senderGeneratedFaceS3url: userCtx.faceinfo.generatedS3url,
      senderOriginFaceS3url: userCtx.faceinfo.originS3url,
      content: message,
      sendTime: new Date(),
    }
    chatCtx.addChat(roomId, newChat);
    const newChatRoom: ChatRoom = { ...chatRooms[roomId], updatedAt: new Date() };
    setChatRooms(prevChatRooms => ({
      ...prevChatRooms,
      [roomId]: newChatRoom,
    }));
  }

  const sendHeart = (receiveId: number) => {
    websocket?.publish({
      destination: '/pub/chat/send-heart',
      headers: {
        Authorization: "Bearer " + authCtx.accessToken,
      },
      body: JSON.stringify({ receiveId: receiveId.toString() })
    });
    setSentHeartIds(prevIds => [...prevIds, receiveId]);
    
  }

  const receiveHeart = (chatRoomListItem: ReceiveHeart) => {
    createAlertMessage("receiveHeart");
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
    setChatRooms(prevChatRooms => ({
      ...prevChatRooms,
      [newChatRoom.roomId]: newChatRoom,
    }));
  }

  const sendHeartResponse = () => {
    createAlertMessage("sendHeartResponse");
    getChatRoomList();
  }

  const receiveHeartResponse = (receiveHeartResponse: ReceiveHeartResponse) => {
    createAlertMessage(JSON.stringify(receiveHeartResponse));
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
      headers: {
        Authorization: "Bearer " + authCtx.accessToken,
      },
      body: JSON.stringify({ senderId: chatRooms[roomId].senderId.toString(), intention: "positive" })
    });
    const newChatRoom: ChatRoom = { ...chatRooms[roomId], type: 'OPENED', updatedAt: new Date() };
    setChatRooms(prevChatRooms => ({
      ...prevChatRooms,
      [roomId]: newChatRoom,
    }));
  }

  const rejectHeart = (roomId: number) => {
    websocket?.publish({
      destination: '/pub/chat/heart-reply',
      headers: {
        Authorization: "Bearer " + authCtx.accessToken,
      },
      body: JSON.stringify({ senderId: chatRooms[roomId].senderId.toString(), intention: "negative" })
    });
    setChatRooms((prevChatRooms) => {
      const { [roomId]: _, ...remainingChatRooms } = prevChatRooms;
      return remainingChatRooms;
    });
  }

  const receiveChat = (receiveChat: ReceiveChat) => {
    const newChat: ChatProps = {
      id: uuidv4(),
      senderId: receiveChat.senderId,
      senderNickname: receiveChat.senderNickname,
      senderGeneratedFaceS3url: receiveChat.senderFaceInfoS3Url,
      senderOriginFaceS3url: receiveChat.senderFaceInfoS3Url,
      sendTime: parseDateString(receiveChat.sendTime),
      // sendTime: new Date(),
      content: receiveChat.content,
    }
    chatCtx.addChat(receiveChat.roomId, newChat);

    // const newChatRoom: ChatRoom = { ...chatRooms[receiveChat.roomId], updatedAt: new Date() };
    // setChatRooms(prevChatRooms => ({
    //   ...prevChatRooms,
    //   [receiveChat.roomId]: newChatRoom,
    // }));
  }

  const getRoomIdBySenderId = (senderId: number): number => {
    for (const key in chatRooms) {
      if (chatRooms[key].senderId === senderId) {
        return chatRooms[key].roomId;
      }
    }
    return 0;
  };

  const transformAndSortChatBuffer = (chatBuffer: ChatProps[]): { [roomId: number]: ChatProps[] } => {
    const result: { [key: number]: ChatProps[] } = {};
  
    chatBuffer.forEach(chat => {
      const senderId = chat.senderId; // sender가 senderId인지 확인 필요
      const roomId = getRoomIdBySenderId(senderId); // senderId가 숫자로 변환 가능한지 확인 필요
  
      if (roomId !== undefined) {
        if (!result[roomId]) {
          result[roomId] = [];
        }
        result[roomId].push(chat);
      }
    });
  
    Object.keys(result).forEach(roomId => {
      result[Number(roomId)].sort((a, b) => a.sendTime.getTime() - b.sendTime.getTime());
    });
  
    return result;
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

  useEffect(() => {
    chatBufferRef.current = chatBuffer;
  }, [chatBuffer]);

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

  useEffect(() => {
    if (authCtx.status !== 'INITIALIZED') return;
    setTimeout(() => {
      getChatRoomList();
    }, 1500)
  }, [authCtx.status])


  const subscriptions = new Map();

  useEffect(() => {
    if (authCtx.status !== 'INITIALIZED') return;
    const stompClient = new Client({
      brokerURL: SOCKET_URL, 
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

    const path = `/sub/chat/${authCtx.userId}`;
    stompClient.onConnect = (frame) => {
      setTimeout(() => {
        console.log("Connected: " + frame);
        if (subscriptions.has(path)) return;
        const subscription = stompClient.subscribe(path, (message) => {
          const { binaryBody, ...response } = message;
          // console.log("\n\n\n\n\n", JSON.stringify(response));
          console.log("\nbinarybody:", binaryBodyToString(binaryBody));
          createAlertMessage(binaryBodyToString(binaryBody));
          if (binaryBodyToString(binaryBody) === "대화 요청 성공") {
            console.log("sendHeartResponse");
            sendHeartResponse();
          }
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
        });
        subscriptions.set(path, subscription);
      }, 1000);

      setTimeout(() => {
        stompClient.publish({
          destination: '/pub/stomp/connect',
          headers: {
            Authorization: "Bearer " + authCtx.accessToken,
          },
        })
      }, 2500);
    };

    stompClient.onStompError = (frame) => {
      console.error("Broker reported error: " + frame.headers["message"]);
      console.error("Additional details: " + frame.body);
    };

    stompClient.activate();
    setWebsocket(stompClient);

    return () => {
      stompClient.publish({
        destination: '/pub/stomp/disconnect',
        headers: {
          Authorization: "Bearer " + authCtx.accessToken,
        },
      })
      stompClient.deactivate();
    };
  }, [authCtx.status]);
  
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);

  const disconnect = async () => {
    const method = 'disconnect: ' + authCtx.accessToken + '\n';
    const endpoint = `${LOCALHOST}/stomp/disconnect`;
    const config = { 
      headers: { Authorization: 'Bearer ' + authCtx.accessToken } 
    };
    try {
      const response = await axios.post(endpoint, null, config);
      console.log(method, response.data);
    }
    catch (error) {
      console.log(method, error);
    }
  }

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        console.log('포그라운드 전환');
        websocket?.publish({
          destination: '/pub/stomp/connect',
          headers: {
            Authorization: "Bearer " + authCtx.accessToken,
          },
        })    
      } else if (nextAppState === 'background') {
        console.log('백그라운드 전환');
        disconnect();
      } else if (nextAppState === 'inactive') {
        console.log('앱 종료');
        disconnect();
      }
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [authCtx.accessToken]);

  const value = useMemo(() => ({
    websocket,
    sentHeartIds,
    chatRooms,
    getChatRoomList,
    sendHeart,
    acceptHeart,
    rejectHeart,
    leftRoom,
    fetchChat,
    sendChat,
  }), [websocket, chatRooms, sentHeartIds]);

  return <ChatRoomContext.Provider value={value}>{children}</ChatRoomContext.Provider>;
};

export default ChatRoomContextProvider;
