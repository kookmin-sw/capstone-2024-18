import { StyleSheet, View, FlatList, Pressable, Text, Keyboard, NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import { useState, useRef, useEffect } from "react";
import ChatList from "./ChatList";
import ChatInput from "./ChatInput";
import { colors } from "../../assets/colors";
import { clearChatHistory, loadChatHistory, saveChatHistory } from "../../util/encryptedStorage";
import { ChatProps } from "./Chat";
import io from 'socket.io-client';

const SOCKET_URL = "";

const UUID = "0";

const ChatPage = () => {
  const [chats, setChats] = useState<ChatProps[]>([]);
  const [newId, setNewId] = useState(0);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [chatHeights, setChatHeights] = useState<number[]>([]);
  const [sendCounter, setSendCounter] = useState(0);
  
  const ChatListRef = useRef<FlatList<ChatProps> | null>(null);
  const localDate = new Date();

  const getNewId = () => {
    setNewId(newId + 1);
    return newId;
  }

  const getChatHeight = (chat: ChatProps) => {
    if (chat.isInitial) return 67;
    else return 47;
  }

  const areDatesEqual = (date1: Date | undefined, date2: Date | undefined) => {
    if (date1 === undefined || date2 === undefined) return true;
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate() &&
      date1.getHours() === date2.getHours() &&
      date1.getMinutes() === date2.getMinutes()
    );
  }

  const sendChat = (message: string) => {
    const timestamp = new Date(localDate.getTime());
    const newChat: ChatProps = { 
      message, 
      nickname: "nickname",
      uuid: UUID, 
      id: getNewId(), 
      timestamp,
    };
    addChat(newChat);
    setSendCounter(sendCounter + 1);
  }

  useEffect(() => {
    scrollToEnd();
  }, [sendCounter])

  const getIsSequenceChat = (prevChat: ChatProps, newChat: ChatProps) => {
    return areDatesEqual(prevChat?.timestamp, newChat?.timestamp) && prevChat?.uuid == UUID;
  }

  const addChat = (chat: ChatProps) => {
    if (chats.length) {
      const prevChat = chats[chats.length - 1];
      const isSequence = getIsSequenceChat(prevChat, chat);
      const newPrevChat = {...prevChat, isFinal: !isSequence };
      const newChat = {...chat, isInitial: !isSequence, isFinal: true};
      console.log(prevChat.isInitial, prevChat.isFinal, newChat.isInitial, newChat.isFinal);
      setChats([...chats.slice(0, -1), newPrevChat, newChat]);
      setChatHeights([...chatHeights.slice(0, -1), getChatHeight(newPrevChat), getChatHeight(newChat)]);
    }
    else {
      console.log(chat.isInitial, chat.isFinal);
      setChats([chat]);
      setChatHeights([getChatHeight(chat)]);
    }
  }

  const handleSaveChatHistory = async () => {
    saveChatHistory(chats);
  }

  const handleLoadChatHistory = async () => {
    const chatHistory = await loadChatHistory();
    setChats(chatHistory ? chatHistory as ChatProps[] : []);
  }

  const handleLoadDummyHistory = async () => {
    const array = Array.from({ length: 1000 }, (_, index) => index);
    const dummyChats = array.map((item) => {
      return { 
        message: item.toString(), 
        uuid: (item % 2).toString(),
        id: item,
        nickname: (item % 2).toString(),
        isInitial: true,
        isFinal: true,
        timestamp: new Date(0),
      } as ChatProps
    });
    setChats(dummyChats);
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

  const scrollToIndex = (index: number, method="scrollToIndex") => {
    console.log("scrollToIndex:", index);
    if (index < 0) return;
    try {
      ChatListRef?.current?.scrollToIndex({ animated: false, index });
    }
    catch (error) {
      console.log(`${method}: ${error}`);
    }
  }

  const scrollToEnd = () => {
    const index = chats.length - 1;
    console.log("scrollToEnd", index);
    if (index < 0) return;
    scrollToIndex(index, "scrollToEnd");
  };
  
  const fetchChatHistory = async (page: number) => {
    try {
      const response = await fetch(`https://swapi.py4e.com/api/people/?page=${page % 5 + 1}`);
      const data = await response.json();
      const chats: ChatProps[] = data.results.map((result: { name: string, birth_year: string, created: string }, index: number) => {
        const prevResult = index ? data.results[index - 1] : undefined;
        const nextResult = data.results[index + 1];
        const newChat = { 
          message: result.name, 
          nickname: `page${page}`,
          uuid: `page${page}`, 
          id: result.created + page, 
          timestamp: new Date(0),
          isInitial: prevResult ? false : true,
          isFinal: nextResult ? false : true,
        };
        return newChat;
      });
      return chats;
    } catch (error) {
      console.error('fetchChatHistory:', error);
    }
  }

  const handleFetchChatHistory = async () => {
    const fetchedChats = await fetchChatHistory(page);
    if (!fetchedChats) return;

    setChats([...fetchedChats, ...chats]);
    setPage(page + 1);
    const newCahtHeights = fetchedChats.map(chat => getChatHeight(chat));
    setChatHeights([...newCahtHeights, ...chatHeights]);
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

  const hanleOnScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => { 
    const position = event.nativeEvent.contentOffset.y;
    setScrollPosition(position); 
  };

  useEffect(() => {
    const loadChat = async () => { 
      try { 
          console.log("채팅 로딩 시도");
          await handleLoadChatHistory();
          console.log("채팅 로딩 성공");
      } catch (error) { 
          console.error('채팅 로딩 실패:', error); 
      } 
    }
    loadChat();
  }, [])

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ['websocket'], 
    });

    console.log('소켓 통신 연결 시작');
    socket.on('connect', () => {
      console.log('소켓 통신 연결됨');
    });

    socket.on('message', (newChat: ChatProps) => {
      console.log('New chat:', newChat.message);
      setChats([...chats, newChat]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', (event) => {
      setKeyboardHeight(event.endCoordinates.height);
      console.log('Keyboard shown');
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
      console.log('Keyboard hidden');
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const options = (
    <View style={{position: "absolute", bottom: 0}}>
      <View style={{ flexDirection: "row" }}>
        <Pressable style={styles.option} onPress={handleClearChat}><Text style
        ={styles.optionText}>채팅 초기화</Text></Pressable>
        <Pressable style={styles.option} onPress={handleClearChatHistory}><Text style
        ={styles.optionText}>캐시 초기화</Text></Pressable>
        <Pressable style={styles.option} onPress={scrollToEnd}><Text style
        ={styles.optionText}>아래로</Text></Pressable>
      </View>
      <View style={{ flexDirection: "row" }}>
        <Pressable style={styles.option} onPress={handleSaveChatHistory}><Text style
        ={styles.optionText}>저장</Text></Pressable>
        <Pressable style={styles.option} onPress={handleLoadChatHistory}><Text style
        ={styles.optionText}>불러오기</Text></Pressable>
        <Pressable style={styles.option} onPress={handleLoadDummyHistory}><Text style
        ={styles.optionText}>더미 불러오기</Text></Pressable>
      </View>
    </View>
  )

  return (
    <View style={styles.container}>
      <View style={{flex:1}}>
      <ChatList 
        chats={chats} 
        chatHeights={chatHeights}
        ref={ChatListRef} 
        onRefresh={handleOnRefresh} 
        refreshing={refreshing}
        onScroll={hanleOnScroll}
        keybordHeight={keyboardHeight}
      />
      {options}
      </View>
      <ChatInput sendChat={sendChat}/>
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

