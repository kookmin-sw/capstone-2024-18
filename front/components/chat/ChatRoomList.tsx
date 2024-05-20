import { useState, useContext, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { colors } from '../../assets/colors';
import HeaderBar from '../HeaderBar';
import ChatPage from './ChatPage';
import { ChatRoomContext } from '../../store/chat-room-context';
import { formatTimeDifference } from '../../util/formatTime';
import { AuthContext } from '../../store/auth-context';
import { Icon, IconButton } from 'react-native-paper';
import CustomButton from '../CustomButton';

const ChatRoomList = ({navigation}: any) => {
  const authCtx = useContext(AuthContext);
  const chatRoomCtx = useContext(ChatRoomContext);
  
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

  const defaultContent = 
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

  const chatRoomList =
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
        <View style={styles.listItemRightContainer}>
          <View style={{ flex: 1 }}>
            {chatRoom.content === '하트를 받았습니다.' && 
            <View style={{ flexDirection: 'row' }}>
              <IconButton 
                onPress={() => {chatRoomCtx.rejectHeart(chatRoom.roomId)}} 
                icon='close-thick' 
                style={styles.rejectButtonContainer} 
                size={20} 
                iconColor='#FFFFFFBB'
              />
              <IconButton 
                onPress={() => {chatRoomCtx.acceptHeart(chatRoom.roomId); setRoomId(chatRoom.roomId)}} 
                icon='check-bold' 
                style={styles.acceptButtonContainer} 
                size={20} 
                iconColor={colors.pastel_point}
              />
            </View>}
          </View>
          <Text style={styles.elapsedTimeText}>{formatTimeDifference(chatRoom.updatedAt)}</Text>
        </View>
      </View>
    </Pressable>)
    )}
  </ScrollView>

  return (
    <View style={styles.container}>
    {!roomId && <>
      <HeaderBar onPress={() => {}}>다이렉트 메세지</HeaderBar>
      <Text style={{color:'black'}}>myUserId: {authCtx.userId}</Text>
      {Object.keys(chatRoomCtx.chatRooms).length ? chatRoomList : defaultContent}
    </>}
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
    color: colors.gray9,
  },
  nickname: {
    color: colors.gray9,
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
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    borderWidth: 1,
  },
  elapsedTimeText: {
    color: colors.gray6, 
    fontSize: 12, 
    textAlign: 'right',
    padding: 5,
  },
  acceptButtonContainer: {
    width: 30,
    height: 30,
    backgroundColor: colors.point,
    borderRadius: 30,
    margin: 0,
    marginRight: 8,
    marginTop: 8,
  },
  rejectButtonContainer: {
    width: 30,
    height: 30,
    backgroundColor: colors.gray5,
    borderRadius: 30,
    margin: 0,
    marginRight: 8,
    marginTop: 8,
  },
  heartButtonText: {
    color: '#FFFFFF80',
    fontSize: 12,
  },
  listItemRightContainer: {

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