import Chat, { ChatProps } from "./Chat";
import { StyleSheet, FlatList, NativeSyntheticEvent, NativeScrollEvent, View, Text } from "react-native";
import { forwardRef, Ref, useCallback } from "react";
import { colors } from "../../assets/colors";

interface Props {
  chats: ChatProps[];
  chatHeights: number[];
  onRefresh: () => void;
  refreshing: boolean;
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  keybordHeight: number;
}

const ChatList = forwardRef<FlatList<ChatProps>, Props>(({ 
  chats,
  chatHeights,
  onRefresh,
  refreshing,
  onScroll,
  keybordHeight,
}, ref: Ref<FlatList<ChatProps>>) => {

  const renderItem = ({ item, index }: { item: ChatProps; index: number }) => {
    const { id, message, nickname, uuid, timestamp, isFinal, isInitial} = item;
    const prevChat = index ? chats[index - 1] : undefined;
    const nextChat = index === chats.length - 1 ? undefined : chats[index + 1];
    
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

    const isDailyInitial = prevChat?.timestamp.getDate() != timestamp.getDate();

    return (
      <>
        {isDailyInitial && 
        <View style={styles.dailyBorderContainer}>
          <View style={styles.dailyBorder}/>
          <Text style={styles.dailyBorderText}>
            {`${timestamp.getFullYear()}년 ${timestamp.getMonth() + 1}월 ${timestamp.getDate()}일`}
          </Text>
        </View>}
        <Chat 
          id={index}
          uuid={uuid}
          nickname={nickname}
          message={message} 
          timestamp={timestamp}
          isInitial={isInitial !== undefined ? isInitial : prevChat?.uuid !== uuid}
          isFinal={isFinal !== undefined ? isFinal : nextChat?.uuid !== uuid || areDatesEqual(prevChat?.timestamp, timestamp) }
        />
      </>
    );
  }

  const getItemLayout = useCallback((data: ArrayLike<ChatProps> | null | undefined, index: number) => ({
    length: chatHeights[index],
    offset: chatHeights.slice(0, index).reduce((sum, height) => sum + height, 0) - keybordHeight, 
    index
  }), [chatHeights, keybordHeight]);

  const keyExtractor = useCallback((chat: ChatProps) => {
    return chat.id.toString()
  }, [])

  return (
    <View style={styles.container}>
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
  dailyBorder: {
    marginHorizontal: 40,
    marginTop: 20,
    borderBottomWidth: 1,
    borderColor: colors.gray4,
  },
  dailyBorderContainer: {
  },
  dailyBorderText: {
    color: colors.gray6,
    textAlign: "center",
    marginVertical: 10,
  }
})