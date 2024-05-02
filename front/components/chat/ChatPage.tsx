import { StyleSheet, View, FlatList, Pressable, Text, Keyboard, NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import { useState, useRef, useEffect, useContext } from "react";
import ChatList from "./ChatList";
import ChatInput from "./ChatInput";
import { colors } from "../../assets/colors";
import { clearChatHistory, loadChatHistory, saveChatHistory } from "../../util/encryptedStorage";
import { ChatProps } from "./Chat";
import { ChatContext } from "../../store/chat-context";

const SOCKET_URL = "";

const UUID = "0";

const ChatPage = () => {
  const [chats, setChats] = useState<ChatProps[]>([]);
  const [newId, setNewId] = useState(0);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [chatHeights, setChatHeights] = useState<number[]>([]);
  const [sendingChat, setSendingChat] = useState<ChatProps | null>(null);
  
  const ChatListRef = useRef<FlatList<ChatProps> | null>(null);
  const localDate = new Date();

  const chatCtx = useContext(ChatContext);

  const getNewId = () => {
    setNewId(newId + 1);
    return newId;
  }
  
  const sendChat = (message: string) => {
    const timestamp = new Date(localDate.getTime());
    const newChat: ChatProps = { 
      message, 
      nickname: "nickname",
      uuid: UUID, 
      id: Math.random().toString(), 
      timestamp,
    };
    setSendingChat(newChat);
    chatCtx.addChat(newChat);
  }

  const handleLoadDummyHistory = async () => {
    const array = Array.from({ length: 100 }, (_, index) => index);
    const dummyChats = array.map((item) => {
      const id = Math.random().toString();
      return { 
        message: id,
        uuid: (item % 2).toString(),
        id,
        nickname: (item % 2).toString(),
        isInitial: true,
        isFinal: true,
        timestamp: new Date(0),
        setHeight: (height: number) => { handleSetChatHeight(item, height) },
      }
    });
    setChats([...chats, ...dummyChats]);
  }

  const handleClearChatHistory = async() => {
    clearChatHistory();
    setChats([]);
  }

  const handleClearChat = async() => {
    setChats([]);
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
    scrollToIndex(chats.length - 1);
    // scrollToIndex(1);
  };
  
  const handleFetchChatHistory = async () => {
    const fetchedChats = await chatCtx.fetchChatHistory(page);
    if (!fetchedChats) return;

    setChats([...fetchedChats, ...chats]);
    setPage(page + 1);
    scrollToIndex(fetchedChats.length - 1);
  }

  const handleOnRefresh = async () => {
    try{
      if (refreshing) return;
      setRefreshing(true);
      await handleFetchChatHistory();
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

  useEffect(() => {
    scrollToEnd();
  }, [chats]);

  const options = (
    <View style={{position: "absolute", top: 0}}>
      <View style={{ flexDirection: "row" }}>
        <Pressable style={styles.option} onPress={handleClearChat}><Text style
        ={styles.optionText}>채팅 초기화</Text></Pressable>
        <Pressable style={styles.option} onPress={handleClearChatHistory}><Text style
        ={styles.optionText}>캐시 초기화</Text></Pressable>
        <Pressable style={styles.option} onPress={scrollToEnd}><Text style
        ={styles.optionText}>아래로</Text></Pressable>
      </View>
      <View style={{ flexDirection: "row" }}>
        <Pressable style={styles.option} onPress={chatCtx.handleSaveChatHistory}><Text style
        ={styles.optionText}>저장</Text></Pressable>
        <Pressable style={styles.option} onPress={chatCtx.handleLoadChatHistory}><Text style
        ={styles.optionText}>불러오기</Text></Pressable>
        <Pressable style={styles.option} onPress={handleLoadDummyHistory}><Text style
        ={styles.optionText}>더미 불러오기</Text></Pressable>
      </View>
    </View>
  )

  return (
    <View style={styles.container}>
      <ChatList 
        chats={chats} 
        chatHeights={chatHeights}
        ref={ChatListRef} 
        onRefresh={handleOnRefresh} 
        refreshing={refreshing}
        onScroll={handleOnScroll}
        setChatHeight={handleSetChatHeight}
      />
      <ChatInput sendChat={sendChat}/>
      {options}
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

