import { StyleSheet, View, FlatList, Pressable, Text, Keyboard, NativeSyntheticEvent, NativeScrollEvent, ScrollView } from "react-native";
import { useState, useRef, useEffect, useContext } from "react";
import ChatList from "./ChatList";
import ChatInput from "./ChatInput";
import { colors } from "../../assets/colors";
import { ChatProps } from "./Chat";
import { ChatContext } from "../../store/chat-context";
import HeaderBar from "../HeaderBar";
import { v4 as uuidv4 } from 'uuid';
import { UserContext } from "../../store/user-context";
import { AuthContext } from "../../store/auth-context";
import { ChatRoomContext } from "../../store/chat-room-context";
import OtherUserSelfProduceChat from "../../pages/OtherUserSelfProduceChat";
import CustomButton from "../CustomButton";

interface Prop {
  onBack: () => void,
  roomId: number,
}

const ChatPage = ({ onBack, roomId }: Prop) => {

  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [chatHeights, setChatHeights] = useState<number[]>([]);

  const ChatListRef = useRef<FlatList<ChatProps> | null>(null);

  const chatCtx = useContext(ChatContext);
  const chatRoomCtx = useContext(ChatRoomContext);
  const userCtx = useContext(UserContext);
  const authCtx = useContext(AuthContext);

  const chats = chatCtx.chats[roomId];
  const chatRoom = chatRoomCtx.chatRooms[roomId];

  const handleSendChat = (message: string) => {
    chatRoomCtx.sendChat(roomId, message);
  }

  const handleLoadDummyHistory = async (roomId: number) => {
    const array = Array.from({ length: 100 }, (_, index) => index);
    const dummyChats = array.map((item) => {
      return { 
        id: uuidv4(),
        senderId: item % 2,
        senderNickname: 'nickname' + item % 2,
        senderGeneratedFaceS3url: userCtx.faceinfo.generatedS3url,
        senderOriginFaceS3url: userCtx.faceinfo.originS3url,      
        content: 'message' + item % 2, 
        sendTime: new Date(0),
        setHeight: (height: number) => { handleSetChatHeight(item, height) },
      }
    });
    chatCtx.prependChats(roomId, dummyChats);
  }

  const scrollToPosition = (position: number) => {
    try {
      if (ChatListRef.current) {
        ChatListRef.current.scrollToOffset({ animated: false, offset: position });
        setScrollPosition(position);  
      }
    }
    catch (error) {
      console.log(`scrollToPosition: ${error}`);
    }
  }

  const scrollToIndex = (index: number, animated?: boolean) => {
    const offset = chatHeights.slice(0, index).reduce((sum, height) => sum + height, 0);
    ChatListRef.current?.scrollToOffset({ offset, animated });
  }

  const scrollToEnd = () => {
    if (!chatCtx.chats[roomId]) return;
    if (chatCtx.chats[roomId].length === 0) return;
    scrollToIndex(chatCtx.chats[roomId].length - 1);
  };
  
  // const handleFetchChatHistory = async () => {
  //   const fetchedChats = await chatCtx.fetchChatHistory(page);
  //   if (!fetchedChats) return;

  //   chatCtx.setChats([...fetchedChats, ...chatCtx.chats]);
  //   setPage(page + 1);
  //   scrollToIndex(fetchedChats.length - 1);
  // }

  const handleOnRefresh = async () => {
    try{
      if (refreshing) return;
      setRefreshing(true);
      // const sendTime = chats.length ? chats[0].sendTime : new Date();
      // await chatRoomCtx.fetchChat(roomId, sendTime, page);
      // setPage(prevPage => prevPage + 1);
      setRefreshing(false);
    } catch (error) {
      console.log("handleOnRefresh:", error);
    }
  }

  const handleOnScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => { 
    const position = event.nativeEvent.contentOffset.y;
    setScrollPosition(position); 
  };

  const handleSetChatHeight = (index: number, height: number) => {
    setChatHeights((prevChatHeight) => {
      const newChatHeight = [...prevChatHeight];
      newChatHeight[index] = height;
      return newChatHeight;
    })
  };

  const sentHeartContent = 
    <View>
      <Text style={{ color: colors.gray6, fontSize: 15, alignSelf: 'center' }}>상대에게 하트를 보냈습니다.</Text>
      <Text style={{ color: colors.gray6, fontSize: 15, alignSelf: 'center' }}>하트를 수락하면 채팅을 시작할 수 있습니다.</Text>
    </View>

  const receiveHeartContent =
    <View style={{ flex: 1 }}>
      <Text style={{ color: colors.gray6, fontSize: 15, alignSelf: 'center' }}>상대가 하트를 보냈습니다.</Text>
      <Text style={{ color: colors.gray6, fontSize: 15, alignSelf: 'center' }}>하트를 수락하면 채팅을 시작할 수 있습니다.</Text>
      <ScrollView contentContainerStyle={{ flex: 1 }}>
        <OtherUserSelfProduceChat senderId={chatRoomCtx.chatRooms[roomId].senderId}/>

        <View style={{flexDirection: 'row', paddingHorizontal: 20, paddingTop: 30}}>
            <View style={{width: "50%" }}>
              <CustomButton 
                containerStyle={{backgroundColor: colors.gray4, marginHorizontal: 10, elevation: 4}} onPress={() => { chatRoomCtx.rejectHeart(roomId); onBack(); }}
                textStyle={{color: colors.white, fontSize:18, letterSpacing: -18* 0.02, fontFamily: "Pretendard-SemiBold"}}>거절하기
              </CustomButton>
            </View>
            <View style={{width: "50%"}}>
              <CustomButton 
                containerStyle={{backgroundColor: colors.point, marginHorizontal: 10, elevation: 4}} onPress={() => { chatRoomCtx.acceptHeart(roomId) }}
                textStyle={{color: colors.white, fontSize:18, letterSpacing: -18* 0.02, fontFamily: "Pretendard-SemiBold"}}>
                수락하기
              </CustomButton>
            </View>
          </View>
      </ScrollView>
    </View>

  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', (event) => {
      setKeyboardHeight(event.endCoordinates.height);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  useEffect(() => {
    // console.log("keyboardHeight:", keyboardHeight);
    setScrollPosition(scrollPosition + keyboardHeight);
  }, [keyboardHeight])

  useEffect(() => {
    // scrollToPosition(scrollPosition);
  }, [scrollPosition])

  // useEffect(() => {
  //   return (() => {
  //     chatCtx.setChats((prevChats) => {
  //       return { 1: [] }
  //     })
  //   })
  // })

  useEffect(() => {
    console.log("chatRoom:", chatRoom);
  }, [chatRoom])

  useEffect(() => {
    scrollToEnd();
  }, [chats])

  return (
    <View style={styles.container}>
      <HeaderBar onPress={onBack}>
        <Text style={{ color: 'black', fontSize: 24 }}>{chatRoom?.senderNickname}</Text>
        <Text style={{ color: 'black', fontSize: 12 }}>roomId: {roomId} senderId: {chatRoom.senderId}</Text>
      </HeaderBar>
      {(chatRoom?.type === 'OPENED' || chatRoom?.type === 'CLOSED') && <ChatList 
        chats={chats} 
        chatHeights={chatHeights}
        ref={ChatListRef} 
        onRefresh={handleOnRefresh} 
        refreshing={refreshing}
        onScroll={handleOnScroll}
        setChatHeight={handleSetChatHeight}
      />}
      {chatRoom?.type === 'SENT_HEART' && sentHeartContent}
      {chatRoom?.type === 'RECEIVED_HEART' && receiveHeartContent}
      {chatRoom?.type === 'OPENED' && <ChatInput sendChat={handleSendChat}/>}
    </View>
  ) 
}

export default ChatPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  option:{
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    margin: 2,
  },
  optionText: { 
    color: colors.gray5, 
    borderColor: colors.gray1, 
    borderWidth: 1, 
    borderRadius: 8, 
    fontSize: 12, 
    padding: 5 
  },
  acceptButton: {
    flex: 1,
    height: 60,
    justifyContent: "center",
    alignItems: 'center',
    backgroundColor: colors.point,
    borderRadius: 16,
    elevation: 2,
  },
  rejectButton: {
    flex: 1,
    height: 60,
    justifyContent: "center",
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: colors.gray6,
    elevation: 2,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
  }
})

