import Chat, { ChatProps } from "./Chat";
import { StyleSheet, FlatList, NativeSyntheticEvent, NativeScrollEvent, View, Keyboard, Dimensions } from "react-native";
import { forwardRef, Ref, useCallback, useEffect, useState } from "react";

interface Props {
  chats: ChatProps[];
  chatHeights: number[];
  refreshing: boolean;
  onRefresh: () => void;
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  setChatHeight: (index: number, height: number) => void;
}

const ChatList = forwardRef<FlatList<ChatProps>, Props>(({ 
  chats,
  chatHeights,
  refreshing,
  onRefresh,
  onScroll,
  setChatHeight,
}, ref: Ref<FlatList<ChatProps>>) => {

  const renderItem = ({ item, index }: { item: ChatProps; index: number }) => {
    const { 
      id,
      senderId, 
      senderNickname, 
      senderGeneratedFaceS3url, 
      senderOriginFaceS3url, 
      content, 
      sendTime, 
      isDailyInitial, 
      isInitial, 
      isFinal, 
    } = item;
    
    return (
      <Chat 
        id={id}
        senderId={senderId}
        senderNickname={senderNickname}
        senderGeneratedFaceS3url={senderGeneratedFaceS3url}
        senderOriginFaceS3url={senderOriginFaceS3url}
        content={content} 
        sendTime={sendTime}
        isInitial={isInitial}
        isDailyInitial={isDailyInitial}
        isFinal={isFinal}
        setHeight={(height: number) => { setChatHeight(index, height) }}
      />
    );
  }
  

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', (event) => {
    const keyboardHeight = event.endCoordinates.height;
    setFlatListHeight(prevHeight => prevHeight - keyboardHeight + bottomNavigateHeight);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
    setFlatListHeight(initialFlatListHeight);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const getItemLayout = useCallback((data: ArrayLike<ChatProps> | null | undefined, index: number) => ({
    length: chatHeights[index],
    offset: chatHeights.slice(0, index).reduce((sum, height) => sum + height, 0), 
    index
  }), [chatHeights]);

  const keyExtractor = useCallback((chat: ChatProps) => {
    return chat.id;
  }, [])

  const screenHeight = Dimensions.get('window').height;
  const chatInputHeight = 40;
  const bottomNavigateHeight = 80;
  const headerHeight = 83;
  const initialFlatListHeight = screenHeight - chatInputHeight - headerHeight - bottomNavigateHeight;
  const [flatListHeight, setFlatListHeight] = useState(initialFlatListHeight);

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