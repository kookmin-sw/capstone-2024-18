import React, { createContext, useState, useEffect, useMemo, useContext} from 'react';
import axios from 'axios';
import Config from 'react-native-config';

import StompJs, { IMessage, Client } from '@stomp/stompjs';
import { AuthContext } from './auth-context';
import { binaryBodyToString } from '../util/binaryBodyToString';
import { ChatContext } from './chat-context';
import { ChatProps } from '../components/chat/Chat';
import { v4 as uuidv4 } from 'uuid';
import { UserContext } from './user-context';

const LOCALHOST = Config.LOCALHOST;
const SOCKET_URL = Config.SOCKET_URL;

interface ChatRoomContextType {
  websocket: StompJs.Client | null,
  receivedHeartRooms: ChatRoom[],
  sentHeartIds: number[],
  chatRooms: ChatRoom[],
  getChatRoomList: () => void;
  sendHeart: (receiveId: number) => void,
  acceptHeart: (receiveId: number) => void,
  rejectHeart: (receiveId: number) => void,
  enterRoom: (roomId: number) => void,
  exitRoom: (roomId: number) => void,
  leftRoom: (roomId: number) => void,
  fetchChat: (roomId: number, sendTime: Date, pageNo: number) => void,
  sendChat: (roomId: number, message: string) => void,
}

export const ChatRoomContext = createContext<ChatRoomContextType>({
  websocket: null,
  sentHeartIds: [],
  receivedHeartRooms: [],
  chatRooms: [],
  getChatRoomList: () => {},
  sendHeart: (receiveId: number) => {},
  acceptHeart: (receiveId: number) => {},
  rejectHeart: (receiveId: number) => {},
  enterRoom: (roomId: number) => {},
  exitRoom: (roomId: number) => {},
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
  senderGeneratedS3url: string,
  senderOriginS3url: string,
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

const ChatRoomContextProvider: React.FC<ChatRoomProviderProps> = ({ children }) => {

  const [websocket, setWebsocket] = useState<StompJs.Client | null>(null);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [sentHeartIds, setSentHeartIds] = useState<number[]>([]);
  const [receivedHeartRooms, setReceivedHeartRooms] = useState<ChatRoom[]>([]);

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
      
      chatRoomHeartList.map(chatRoomListItem => {
        if (chatRoomListItem.isSender) {
          setSentHeartIds(prevIds => [...prevIds, chatRoomListItem.senderId ?? 0]);
        } else {
          const newChatRoom: ChatRoom = {
            createdAt: chatRoomListItem.chatRoom.createdAt,
            updatedAt: chatRoomListItem.chatRoom.updatedAt,
            roomId: chatRoomListItem.chatRoom.id,
            status: chatRoomListItem.chatRoom.status,
            public: chatRoomListItem.chatRoom.public,
            senderId: chatRoomListItem.senderId,
            senderNickname: chatRoomListItem.senderNickname,
            senderGeneratedS3url: chatRoomListItem.senderGeneratedS3url,
            senderOriginS3url: chatRoomListItem.senderOriginS3url,
            type: 'HEART',
            content: '',
          }
          setReceivedHeartRooms(prevRooms => [...prevRooms, newChatRoom]);
        }
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
          senderGeneratedS3url: chatRoomListItem.senderGeneratedS3url,
          senderOriginS3url: chatRoomListItem.senderOriginS3url,
          type: 'ROOM',
          content: '',
        }
        setChatRooms(prevRooms => [...prevRooms, newChatRoom]);
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
          senderGeneratedS3url: chatRoomListItem.senderGeneratedS3url,
          senderOriginS3url: chatRoomListItem.senderOriginS3url,
          type: 'ROOM',
          content: chatRoomListItem.content ?? '',
        };
        setChatRooms(prevRooms => [...prevRooms, newChatRoom]);
      });

      chatRoomCloseList.map(chatRoomListItem => {
        const newChatRoom: ChatRoom = {
          createdAt: chatRoomListItem.chatRoom.createdAt,
          updatedAt: chatRoomListItem.chatRoom.updatedAt,
          roomId: chatRoomListItem.chatRoom.id,
          status: chatRoomListItem.chatRoom.status,
          public: chatRoomListItem.chatRoom.public,
          senderId: 0,
          senderNickname: '(알수없음)',
          senderGeneratedS3url: '',
          senderOriginS3url: '',
          type: 'LEFT',
          content: '',
        };
        setChatRooms(prevRooms => [...prevRooms, newChatRoom]);
      });

    } catch (error) {
      console.log(error);
    }
  };

  const enterRoom = async (roomId: number) => {
    const method = "enterRoom";
    const endpoint = `${LOCALHOST}/chat/${roomId}/enter`;
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

  const exitRoom = async (roomId: number) => {
    const method = "exitRoom";
    const endpoint = `${LOCALHOST}/chat/${roomId}/exit`;
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
  
  const leftRoom = async (roomId: number) => {
    const method = "leftRoom";
    const endpoint = `${LOCALHOST}/chat/${roomId}/left`;
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

  const fetchChat = async (roomId: number, sendTime: Date, pageNo: number) => {
    const method = "fetchChat";
    const endpoint = `${LOCALHOST}/chat/${roomId}/messages?page=${pageNo}`;
    const body = { sendTime: sendTime.toISOString() };
    const config = { 
      headers: { Authorization: 'Bearer ' + authCtx.accessToken } 
    };
    try {
      const response = await axios.post(endpoint, body, config);
      if (response.status === 200) {
        console.log(response);
        // TODO: response의 채팅들을 prependChat에 전달
        return response;
      } 
      else {
        throw new Error(response.statusText);
      }
    } catch(error) {
      console.log(method, error);
    }
  }

  const sendChat = (receiveId: number, message: string) => {
    websocket?.publish({
      destination: '/pub/chat/messages',
      headers: {
        Authorization: "Bearer " + authCtx.accessToken,
      },
      body: JSON.stringify({ 
        roomId: receiveId.toString(), 
        receiveId: receiveId.toString(), 
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
    chatCtx.addChat(receiveId, newChat);
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

  const acceptHeart = (senderId: number) => {
    websocket?.publish({
      destination: '/pub/chat/heart-reply',
      headers: {
        Authorization: "Bearer " + authCtx.accessToken,
      },
      body: JSON.stringify({ senderId: senderId.toString(), intention: "positive" })
    });
    const [ newRoom ] = receivedHeartRooms.filter(room => room.roomId === senderId);
    setChatRooms(prevRooms => [...prevRooms, newRoom]);
    setReceivedHeartRooms(prevRooms => prevRooms.filter(room => room.roomId !== senderId));
  }

  const rejectHeart = (senderId: number) => {
    websocket?.publish({
      destination: '/pub/chat/heart-reply',
      headers: {
        Authorization: "Bearer " + authCtx.accessToken,
      },
      body: JSON.stringify({ senderId: senderId.toString(), intention: "negative" })
    });
    setReceivedHeartRooms(prevRooms => prevRooms.filter(room => room.roomId !== senderId));
  }

  const receiveChat = () => {

  }

  useEffect(() => {
    console.log('receivedHeartRooms:', receivedHeartRooms);
  }, [receivedHeartRooms])

  useEffect(() => {
    console.log('chatRooms:', chatRooms);
  }, [chatRooms])

  useEffect(() => {
    if (authCtx.status !== 'INITIALIZED') return;
    setTimeout(() => {
      getChatRoomList();
    }, 1500)
  }, [authCtx.status])

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

    stompClient.onConnect = (frame) => {
      setTimeout(() => {
        console.log("Connected: " + frame);
        stompClient.subscribe(`/sub/chat/${authCtx.userId}`, (message) => {
          console.log(JSON.stringify(message));
          console.log("binarybody:", binaryBodyToString(message.binaryBody));
        });
      }, 1000);
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

  useEffect(() => {
    console.log("chatRooms:", chatRooms);
  }, [chatRooms])

  const value = useMemo(() => ({
    websocket,
    sentHeartIds,
    receivedHeartRooms,
    chatRooms,
    getChatRoomList,
    sendHeart,
    acceptHeart,
    rejectHeart,
    enterRoom,
    exitRoom,
    leftRoom,
    fetchChat,
    sendChat,
  }), [websocket, receivedHeartRooms, chatRooms, sentHeartIds]);

  return <ChatRoomContext.Provider value={value}>{children}</ChatRoomContext.Provider>;
};

export default ChatRoomContextProvider;
