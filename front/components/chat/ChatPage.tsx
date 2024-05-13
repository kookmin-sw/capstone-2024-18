import { StyleSheet, View, FlatList, Pressable, Text, Keyboard, NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import { useState, useRef, useEffect, useContext } from "react";
import ChatList from "./ChatList";
import ChatInput from "./ChatInput";
import { colors } from "../../assets/colors";
import { clearChatHistory } from "../../util/encryptedStorage";
import { ChatProps } from "./Chat";
import { ChatContext, Chats } from "../../store/chat-context";
import HeaderBar from "../HeaderBar";
import { v4 as uuidv4 } from 'uuid';
import { UserContext } from "../../store/user-context";
import { AuthContext } from "../../store/auth-context";
import { ChatRoomContext } from "../../store/chat-room-context";

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
  const localDate = new Date();

  const chatCtx = useContext(ChatContext);
  const chatRoomCtx = useContext(ChatRoomContext);
  const userCtx = useContext(UserContext);
  const authCtx = useContext(AuthContext);

  const sendChat = (message: string) => {
    const sendTime = new Date(localDate.getTime());
    const newChat: ChatProps = { 
      id: uuidv4(),
      senderId: authCtx.userId,
      senderNickname: userCtx.basicinfo.nickname,
      senderGeneratedFaceS3url: userCtx.faceinfo.generatedS3url,
      senderOriginFaceS3url: userCtx.faceinfo.originS3url,      
      content: message, 
      sendTime,
    };
    chatCtx.addChat(roomId, newChat);
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

  // const scrollToEnd = () => {
  //   scrollToIndex(chatCtx.chats[roomId].length - 1);
  // };
  
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
      const sendTime = chatCtx.chats[roomId][0].sendTime;
      await chatRoomCtx.fetchChat(roomId, sendTime, page);
      setPage(prevPage => prevPage + 1);
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
      const newChatHeight = [...prevChatHeight];  // 배열을 복사하여 새 배열을 생성
      newChatHeight[index] = height;
      return newChatHeight;
    })
  };

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
    console.log("keyboardHeight:", keyboardHeight);
    setScrollPosition(scrollPosition + keyboardHeight);
  }, [keyboardHeight])

  useEffect(() => {
    // scrollToPosition(scrollPosition);
  }, [scrollPosition])

  // useEffect(() => {
  //   scrollToEnd();
  // }, [chatCtx.chats]);

  // const options = (
  //   <View style={{position: "absolute", top: 0}}>
  //     <View style={{ flexDirection: "row" }}>
  //       <Pressable style={styles.option} onPress={handleClearChat}><Text style
  //       ={styles.optionText}>채팅 초기화</Text></Pressable>
  //       <Pressable style={styles.option} onPress={handleClearChatHistory}><Text style
  //       ={styles.optionText}>캐시 초기화</Text></Pressable>
  //       <Pressable style={styles.option} onPress={scrollToEnd}><Text style
  //       ={styles.optionText}>아래로</Text></Pressable>
  //     </View>
  //     <View style={{ flexDirection: "row" }}>
  //       <Pressable style={styles.option} onPress={chatCtx.handleSaveChatHistory}><Text style
  //       ={styles.optionText}>저장</Text></Pressable>
  //       <Pressable style={styles.option} onPress={chatCtx.handleLoadChatHistory}><Text style
  //       ={styles.optionText}>불러오기</Text></Pressable>
  //       <Pressable style={styles.option} onPress={handleLoadDummyHistory}><Text style
  //       ={styles.optionText}>더미 불러오기</Text></Pressable>
  //     </View>
  //   </View>
  // )

  return (
    <View style={styles.container}>
      <HeaderBar onPress={onBack}>{roomId}</HeaderBar>
      <ChatList 
        chats={chatCtx.chats ? chatCtx.chats[roomId] ?? [] : []} 
        chatHeights={chatHeights}
        ref={ChatListRef} 
        onRefresh={handleOnRefresh} 
        refreshing={refreshing}
        onScroll={handleOnScroll}
        setChatHeight={handleSetChatHeight}
      />
      <ChatInput sendChat={sendChat}/>
      {/* {options} */}
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
  }
})

