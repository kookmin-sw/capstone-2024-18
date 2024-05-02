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
  
  const ChatListRef = useRef<FlatList<ChatProps> | null>(null);
  const localDate = new Date();

  const getNewId = () => {
    setNewId(newId + 1);
    return newId;
  }

  const areDatesEqual = (date1: Date | string | undefined, date2: Date | string | undefined) => {
    console.log("date1:", date1, "date2:", date2);

    // date1과 date2가 문자열이라면 Date 객체로 변환
    const d1 = (typeof date1 === 'string' || date1 instanceof Date) ? new Date(date1) : date1;
    const d2 = (typeof date2 === 'string' || date2 instanceof Date) ? new Date(date2) : date2;

    // date1 또는 date2가 유효하지 않은 경우
    if (d1 === undefined || d2 === undefined || isNaN(d1.getTime()) || isNaN(d2.getTime())) {
        return false; // 날짜 데이터가 없거나 유효하지 않으면 같지 않다고 처리
    }

    // 연, 월, 일, 시, 분이 같은지 확인
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate() &&
      d1.getHours() === d2.getHours() &&
      d1.getMinutes() === d2.getMinutes()
    );
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
    addChat(newChat);
  }

  const getIsSequenceChat = (prevChat: ChatProps | undefined, newChat: ChatProps) => {
    if (prevChat === undefined) return false;
    return areDatesEqual(prevChat?.timestamp, newChat?.timestamp) && prevChat?.uuid == UUID;
  }

  const addChat = (chat: ChatProps) => {
    if (chats.length) {
      const prevChat = chats[chats.length - 1];
      const isSequence = getIsSequenceChat(prevChat, chat);
      const newPrevChat = {...prevChat, isFinal: !isSequence };
      const newChat = {...chat, isInitial: !isSequence, isFinal: true};
      console.log("addChat:", prevChat.isInitial, prevChat.isFinal, newChat.isInitial, newChat.isFinal);
      setChats([...chats.slice(0, -1), newPrevChat, newChat]);
    }
    else {
      setChats([{...chat, isInitial: true, isFinal: true}]);
    }
  }

  const handleSaveChatHistory = async () => {
    saveChatHistory(chats);
  }

  const handleLoadChatHistory = async () => {
    const chatHistory = await loadChatHistory();
    console.log(chatHistory);
    setChats(chatHistory ? chatHistory as ChatProps[] : []);
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

