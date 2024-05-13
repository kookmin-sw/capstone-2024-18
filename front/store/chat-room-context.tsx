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
  receivedHeartList: ChatUserListItem[],
  chatUserList: ChatUserListItem[],
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
  receivedHeartList: [],
  chatUserList: [],
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

interface ChatRoom {
  createdAt: Date,
  updatedAt: Date,
  id: number,
  status: string,
  public: boolean,
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
  chatRoom: ChatRoom,
}

interface ChatRoomHeartListItem extends ChatRoomListItem {
  isSender: boolean,
}

interface ChatRoomOpenListItem extends ChatRoomListItem {
  message: string,
}

interface ChatRoomMessageListItem extends ChatRoomListItem {
  content: string,
}

interface ChatRoomCloseListItem {
  memberId: number,
  memberNickname: string,
  memberGeneratedS3url: string,
  memberOriginS3url: string,
  chatRoom: ChatRoom,
  message: string,
}

interface ChatRoomListResponse {
  chatRoomHeartList: ChatRoomHeartListItem[],
  chatRoomOpenList: ChatRoomOpenListItem[],
  chatRoomMessageList: ChatRoomMessageListItem[],
  chatRoomCloseList: ChatRoomCloseListItem[],
}

export interface ChatUserListItem extends ChatRoom {
  id: number,
  nickname: string,
  generatedFaceS3url: string,
  originFaceS3url: string,
  content: string,
}

const ChatRoomContextProvider: React.FC<ChatRoomProviderProps> = ({ children }) => {
  
  // const DUMMY_LIST: ChatUserListItem[] = [1,2,3,4,5,6,7,8,9,10].map(item => {
  //   return {id: item, nickname: `nickname${item}`, generatedFaceS3url: '', originFaceS3url: '', content: 'ㅎㅇㅇ', createdAt: new Date(0), updatedAt: new Date(0), status: 'set', public: true}
  // })

  // const DUMMY_LIST2: ChatUserListItem[] = [11,12,13,14,15,16,17,18,19,20].map(item => {
  //   return {id: item, nickname: `nickname${item}`, generatedFaceS3url: '', originFaceS3url: '', content: '', createdAt: new Date(0), updatedAt: new Date(0), status: 'set', public: true}
  // })

  const [websocket, setWebsocket] = useState<StompJs.Client | null>(null);
  const [chatUserList, setChatUserList] = useState<ChatUserListItem[]>([]);
  const [sentHeartList, setSentHeartList] = useState<number[]>([]);
  const [receivedHeartList, setReceivedHeartList] = useState<ChatUserListItem[]>([]);

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
      const { chatRoomHeartList, chatRoomOpenList, chatRoomMessageList, chatRoomCloseList }: ChatRoomListResponse = response.data;
      
      chatRoomHeartList.map(chatRoomHeartListItem => {
        if (chatRoomHeartListItem.isSender) {
          setSentHeartList(prevIds => [...prevIds, chatRoomHeartListItem.senderId]);
        } else {
          const newUserListItem: ChatUserListItem = {
            createdAt: chatRoomHeartListItem.chatRoom.createdAt,
            updatedAt: chatRoomHeartListItem.chatRoom.updatedAt,
            status: chatRoomHeartListItem.chatRoom.status,
            public: chatRoomHeartListItem.chatRoom.public,
            id: chatRoomHeartListItem.senderId,
            nickname: chatRoomHeartListItem.senderNickname,
            generatedFaceS3url: chatRoomHeartListItem.senderGeneratedS3url,
            originFaceS3url: chatRoomHeartListItem.senderOriginS3url,
            content: '',
          }
          setReceivedHeartList(prevUserListItem => [...prevUserListItem, newUserListItem]);
        }
      });

      chatRoomOpenList.map(chatRoomOpenListItem => {
        const newUserListItem: ChatUserListItem = {
          createdAt: chatRoomOpenListItem.chatRoom.createdAt,
          updatedAt: chatRoomOpenListItem.chatRoom.updatedAt,
          status: chatRoomOpenListItem.chatRoom.status,
          public: chatRoomOpenListItem.chatRoom.public,
          id: chatRoomOpenListItem.senderId,
          nickname: chatRoomOpenListItem.senderNickname,
          generatedFaceS3url: chatRoomOpenListItem.senderGeneratedS3url,
          originFaceS3url: chatRoomOpenListItem.senderOriginS3url,
          content: '',
        };
        setChatUserList(prevUserListItem => [...prevUserListItem, newUserListItem]);
      });

      chatRoomMessageList.map(chatRoomMessageListItem => {
        const newUserListItem: ChatUserListItem = {
          createdAt: chatRoomMessageListItem.chatRoom.createdAt,
          updatedAt: chatRoomMessageListItem.chatRoom.updatedAt,
          status: chatRoomMessageListItem.chatRoom.status,
          public: chatRoomMessageListItem.chatRoom.public,
          id: chatRoomMessageListItem.senderId,
          nickname: chatRoomMessageListItem.senderNickname,
          generatedFaceS3url: chatRoomMessageListItem.senderGeneratedS3url,
          originFaceS3url: chatRoomMessageListItem.senderOriginS3url,
          content: chatRoomMessageListItem.content,
        };
        setChatUserList(prevUserListItem => [...prevUserListItem, newUserListItem]);
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
    setSentHeartList(prevIds => [...prevIds, receiveId]);
  }

  const acceptHeart = (receiveId: number) => {
    websocket?.publish({
      destination: '/pub/chat/heart-reply',
      headers: {
        Authorization: "Bearer " + authCtx.accessToken,
      },
      body: JSON.stringify({ senderId: receiveId.toString(), intention: "positive" })
    });
    const [ newUserListItem ] = receivedHeartList.filter(item => item.id === receiveId);
    setChatUserList(prevUserListItem => [...prevUserListItem, newUserListItem]);
    setReceivedHeartList(prevList => prevList.filter(item => item.id !== receiveId));
  }

  const rejectHeart = (receiveId: number) => {
    websocket?.publish({
      destination: '/pub/chat/heart-reply',
      headers: {
        Authorization: "Bearer " + authCtx.accessToken,
      },
      body: JSON.stringify({ senderId: receiveId.toString(), intention: "negative" })
    });
    setReceivedHeartList(prevList => prevList.filter(item => item.id !== receiveId));
  }

  const receiveChat = () => {

  }

  useEffect(() => {
    console.log('receivedHeartList:', receivedHeartList);
  }, [receivedHeartList])

  useEffect(() => {
    console.log('chatUserList:', chatUserList);
  }, [chatUserList])

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
    console.log("chatUserList:", chatUserList);
  }, [chatUserList])

  const value = useMemo(() => ({
    websocket,
    receivedHeartList,
    chatUserList,
    getChatRoomList,
    sendHeart,
    acceptHeart,
    rejectHeart,
    enterRoom,
    exitRoom,
    leftRoom,
    fetchChat,
    sendChat,
  }), [websocket, receivedHeartList, chatUserList]);

  return <ChatRoomContext.Provider value={value}>{children}</ChatRoomContext.Provider>;
};

export default ChatRoomContextProvider;
