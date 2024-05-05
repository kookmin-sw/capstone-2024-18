import Chat, { ChatProps } from "./Chat";
import { StyleSheet, FlatList, NativeSyntheticEvent, NativeScrollEvent, View, Text, Keyboard, Dimensions } from "react-native";
import { forwardRef, Ref, useCallback, useEffect, useState } from "react";
import { colors } from "../../assets/colors";

interface Props {
  chats: ChatProps[];
  chatHeights: number[];
  onRefresh: () => void;
  refreshing: boolean;
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  setChatHeight: (index: number, height: number) => void;
}

const ChatList = forwardRef<FlatList<ChatProps>, Props>(({ 
  chats,
  chatHeights,
  onRefresh,
  refreshing,
  onScroll,
  setChatHeight,
}, ref: Ref<FlatList<ChatProps>>) => {

  const areDatesEqual = (date1: Date | undefined, date2: Date | undefined) => {
    console.log("areDatesEqual", date1, date2);
    if (date1 === undefined || date2 === undefined) return true;
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate() &&
      date1.getHours() === date2.getHours() &&
      date1.getMinutes() === date2.getMinutes()
    );
  }

  const getSafeDate = (date?: Date) => {
    return date ? new Date(date).getDate() : undefined;
  };
  
  const renderItem = ({ item, index }: { item: ChatProps; index: number }) => {
    const { id, message, nickname, uuid, timestamp, isFinal, isInitial} = item;
    const prevChat = index ? chats[index - 1] : undefined;
    const nextChat = index === chats.length - 1 ? undefined : chats[index + 1];
    
    const prevChatDate = getSafeDate(prevChat?.timestamp);
    const currentDate = getSafeDate(timestamp);
    
    const isDailyInitial = prevChatDate !== currentDate;

    return (
      <Chat 
        id={id}
        uuid={uuid}
        nickname={nickname}
        message={message} 
        timestamp={timestamp}
        isInitial={isInitial ?? (prevChat?.uuid !== uuid)}
        isDailyInitial={isDailyInitial}
        isFinal={isFinal ?? (nextChat?.uuid !== uuid || areDatesEqual(prevChat?.timestamp, timestamp))}
        setHeight={(height: number) => { setChatHeight(index, height) }}
      />
    );
  }
  
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
  }, [keyboardHeight])

  const getItemLayout = useCallback((data: ArrayLike<ChatProps> | null | undefined, index: number) => ({
    length: chatHeights[index],
    offset: chatHeights.slice(0, index).reduce((sum, height) => sum + height, 0), 
    index
  }), [chatHeights, keyboardHeight]);

  const keyExtractor = useCallback((chat: ChatProps) => {
    return chat.id;
  }, [])

  const screenHeight = Dimensions.get('window').height;
  const [flatListHeight, setFlatListHeight] = useState(screenHeight - 40);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (e) => setFlatListHeight(screenHeight - 40 - e.endCoordinates.height)
    );
  
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setFlatListHeight(screenHeight - 40)
    );
  
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    console.log("flatListHeight",flatListHeight);
  }, [flatListHeight])

  return (
    <View style={{ height : flatListHeight, borderWidth: 2, borderColor: "red" }}>
      <FlatList
        ref={ref}
        data={chats}
        renderItem={renderItem}
        getItemLayout={getItemLayout}
        keyExtractor={keyExtractor} 
        onRefresh={onRefresh}
        onScroll={onScroll}
        refreshing={refreshing}
        style={styles.flatList}  
        scrollEventThrottle={16}
        maxToRenderPerBatch={20}
        initialNumToRender={100}
      />
      {/* <View style={{ height: keybordHeight }}/> */}
    </View>
  )
})

export default ChatList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatList:{
    
  },
  
})