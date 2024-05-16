import React, { createContext, useState, useEffect, useMemo, useContext} from 'react';
import axios from 'axios';
import Config from 'react-native-config';

import { AuthContext } from './auth-context';
import { ChatContext } from './chat-context';
import { UserContext } from './user-context';
import { StompClientContext } from './socket-context';

import { ChatProps } from '../components/chat/Chat';
import { createAlertMessage } from '../util/alert';
import { IMessage } from '@stomp/stompjs';

import { v4 as uuidv4 } from 'uuid';
import { binaryBodyToString } from '../util/binaryBodyToString';
import { parseDateString } from '../util/parseTime';

const LOCALHOST = Config.LOCALHOST;

interface ChatRoomContextType {
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

  const [chatRooms, setChatRooms] = useState<{ [roomId: number]: ChatRoom }>({});
  const [sentHeartIds, setSentHeartIds] = useState<number[]>([]);

  const authCtx = useContext(AuthContext);
  const userCtx = useContext(UserContext);
  const chatCtx = useContext(ChatContext);
  const socketCtx = useContext(StompClientContext);

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
        } 
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
          senderGeneratedS3url: chatRoomListItem.senderGeneratedS3url,
          senderOriginS3url: chatRoomListItem.senderOriginS3url,
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
          senderGeneratedS3url: chatRoomListItem.senderGeneratedS3url,
          senderOriginS3url: chatRoomListItem.senderOriginS3url,
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
    if (!socketCtx.stompClient?.connected) return;
    socketCtx.stompClient?.publish({
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
    socketCtx.stompClient?.publish({
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
      senderGeneratedS3url: chatRoomListItem.senderGeneratedS3url,
      senderOriginS3url: chatRoomListItem.senderOriginS3url,
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
    console.log("receiveHeartResponse");
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
    socketCtx.stompClient?.publish({
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
    console.log("receiveHeart");
    socketCtx.stompClient?.publish({
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
    console.log("receiveChat");
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

  useEffect(() => {
    if (authCtx.status !== 'INITIALIZED') return;

    const path = `/sub/chat/${authCtx.userId}`;
    const callback = (message: IMessage) => {
      const messageBody = binaryBodyToString(message.binaryBody);
      if (messageBody === '대화 요청 성공') {
        sendHeartResponse();
      }
      if (messageBody === '저장 성공') {
        
      }
      else {
        const responseData = JSON.parse(messageBody);
        switch (responseData.method) {
          case 'receiveHeart':
            receiveHeart(responseData);
            break;
          case 'receiveChat':
            receiveChat(responseData);
            break;
          case 'receiveHeartResponse':
            receiveHeartResponse(responseData);
            break;
          default:
            console.log('Unknown method:', responseData.method);
            break;
        }
      }
    };
    console.log('@@@@@@@@@@@@@@@@@@@' + authCtx.status);
    socketCtx.subscribe(path, callback);
    return () => socketCtx.unsubscribe(path);
  }, [socketCtx.subscribe, socketCtx.unsubscribe, authCtx.userId, authCtx.status]);

  useEffect(() => {
    if (authCtx.status !== 'INITIALIZED') return;
    getChatRoomList();
  }, [authCtx.status])

  const value = useMemo(() => ({
    sentHeartIds,
    chatRooms,
    getChatRoomList,
    sendHeart,
    acceptHeart,
    rejectHeart,
    leftRoom,
    fetchChat,
    sendChat,
  }), [chatRooms, sentHeartIds]);

  return <ChatRoomContext.Provider value={value}>{children}</ChatRoomContext.Provider>;
};

export default ChatRoomContextProvider;
