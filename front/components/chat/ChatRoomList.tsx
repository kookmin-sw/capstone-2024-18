import { useState, useContext, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { colors } from '../../assets/colors';
import HeaderBar from '../HeaderBar';
import ChatPage from './ChatPage';
import { ChatRoomContext } from '../../store/chat-room-context';
import { formatTimeDifference } from '../../util/formatTime';
import { ChatContext } from '../../store/chat-context';
import { AuthContext } from '../../store/auth-context';
import { Icon } from 'react-native-paper';
import CustomButton from '../CustomButton';

const ChatRoomList = ({navigation}: any) => {
  const chatRoomCtx = useContext(ChatRoomContext);
  const chatCtx = useContext(ChatContext);
  const [roomId, setRoomId] = useState(0);

  const handleOnPress = (roomId: number) => {
    setRoomId(roomId);
  }

  const handleOnBack = () => {
    setRoomId(0);
  }

  useEffect(() => {
    if (roomId) return;
    chatRoomCtx.getChatRoomList();
  }, [roomId])

  const authCtx = useContext(AuthContext);

  return (
    <View style={styles.container}>
    {chatRoomCtx.chatRooms ? <>
      <HeaderBar onPress={() => {}}>다이렉트 메세지</HeaderBar>
      <Text style={{color:'black'}}>myUserId: {authCtx.userId}</Text>
      <ScrollView style={{ padding: 20 }}>
        {Object.values(chatRoomCtx.chatRooms).map((chatRoom) => (
        <Pressable key={chatRoom.roomId} onPress={handleOnPress.bind(this, chatRoom.roomId)}>
          <Text style={{color:'black'}}>roomId: {chatRoom.roomId} senderId:{chatRoom.senderId}</Text>
          <View style={styles.listItemContainer}>
            {!chatRoom.senderGeneratedS3url && <View style={styles.profile}/>}
            {chatRoom.senderGeneratedS3url && <Image
                source={{ uri: chatRoom.senderGeneratedS3url }}
                style={[styles.profile, { backgroundColor: colors.white }]}
              />}
            <View style={{ flex: 1 }}>
              <Text style={styles.nickname}>{chatRoom.senderNickname}</Text>
              <Text style={styles.chatContent}>{chatRoom.content ? chatRoom.content : "대화 내용이 없습니다."}</Text>
            </View>
            <View style={styles.elapsedTimeContainer}>
            <Text style={styles.elapsedTimeText}>{formatTimeDifference(chatRoom.updatedAt)}</Text>
            </View>
          </View>
        </Pressable>)
        )}
      </ScrollView>
    </>:
    <View style={[styles.container, {paddingHorizontal: 32}]}>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Icon size={150} source={require('../../assets/images/surprise.png')}/>
        <View style={{marginTop: 20, alignItems: 'center'}}>
          <Text style={styles.hintText}>채팅방이 존재하지 않습니다. {'\n'}새로운 친구를 찾아보세요!</Text>
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <CustomButton
          containerStyle={{backgroundColor: colors.point, elevation: 4}}
          onPress={()=>{navigation.navigate('sub1')}}
          textStyle={{color: colors.white, fontSize: 18, fontFamily: 'Pretendard-SemiBold', letterSpacing: -18* 0.02}}>새로운 친구 찾으러 가기
        </CustomButton>
      </View>
    </View>
    }
    {!!roomId && <ChatPage onBack={handleOnBack} roomId={roomId}/>}
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
  },
  hintText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 16,
    letterSpacing: -16* 0.02,
    textAlign: 'center',
    color: colors.gray7
  },
  bottomContainer: {
    alignItems: "center",
    marginBottom: 23,
    paddingHorizontal: 8,
  },
})