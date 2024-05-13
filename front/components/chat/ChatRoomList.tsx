import { useState, useContext, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable } from 'react-native';
import { colors } from '../../assets/colors';
import HeaderBar from '../HeaderBar';
import ChatPage from './ChatPage';
import { ChatRoomContext } from '../../store/chat-room-context';
import { formatTimeDifference } from '../../util/formatTimeDifference';

const ChatRoomList = () => {
  const chatRoomCtx = useContext(ChatRoomContext);
  const [modal, setModal] = useState(0);

  const handleOnPress = (opponentId: number) => {
    setModal(opponentId);
  }

  const handleOnBack = () => {
    setModal(0);
  }

  useEffect(() => {
    console.log("chatUserList:", chatRoomCtx.chatUserList);
  }, [chatRoomCtx.chatUserList])

  useEffect(() => {
    if (modal) return;
    chatRoomCtx.getChatRoomList();
  }, [modal])

  return (
    <View style={styles.container}>
    {!modal && <>
      <HeaderBar onPress={() => { }}>다이렉트 메세지</HeaderBar>
      <ScrollView style={{ padding: 20 }}>
        {chatRoomCtx.chatUserList.map(chatUserListItem => 
        <Pressable key={chatUserListItem.id} onPress={handleOnPress.bind(this, chatUserListItem.id)}>
          <View style={styles.listItemContainer}>
            <View style={styles.profile} />
            <View style={{ flex: 1 }}>
              <Text style={styles.nickname}>{chatUserListItem.nickname}</Text>
              <Text style={styles.chatContent}>{chatUserListItem.content ? chatUserListItem.content : "대화 내용이 없습니다."}</Text>
            </View>
            <View style={styles.elapsedTimeContainer}>
              <Text style={styles.elapsedTimeText}>{formatTimeDifference(chatUserListItem.updatedAt)}</Text>
            </View>
          </View>
        </Pressable>
        )}
      </ScrollView>
    </>}
    {!!modal && <ChatPage onBack={handleOnBack} roomId={modal}/>}
    </View>
  )
}

export default ChatRoomList

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  listItemContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 10,
    backgroundColor: colors.gray1,
    height: 75,
    alignItems: 'center',
  },
  listItemText: {
    color: 'black',
  },
  nickname: {
    color: 'black',
    fontSize: 16,
  },
  chatContent:{
    color: colors.gray7,
    fontSize: 14,
  },
  profile: {
    width: 40,
    height: 40,
    backgroundColor: colors.gray4,
    borderRadius: 40,
    margin: 15,
  },
  elapsedTimeContainer: { 
    height: 80, 
    justifyContent: 'flex-start',
  },
  elapsedTimeText: {
    color: colors.gray6, 
    fontSize: 12, 
    marginTop: 10, 
    marginRight: 10,
  }
})