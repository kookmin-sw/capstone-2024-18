import { View, ScrollView, StyleSheet, Text, Pressable  } from "react-native";
import HeaderBar from "../HeaderBar";
import { useContext } from "react";
import { ChatRoomContext, ChatUserListItem } from "../../store/chat-room-context";
import { colors } from "../../assets/colors";
import CustomButton from "../CustomButton";

const ReceivedHeartPage = () => {
  const chatRoomCtx = useContext(ChatRoomContext);  

  return (
    <View style={styles.container}>
      <HeaderBar onPress={()=>{}}>하트 신청 목록</HeaderBar>
      <Text style={{ color: colors.gray5, alignSelf: 'center', marginBottom: 10 }}>하트를 수락하면 채팅을 시작할 수 있어요</Text>
      <ScrollView style={styles.listContainer}>
        {chatRoomCtx.receivedHeartList.map(item => (
          <View style={styles.listItemContainer} key={item.id}>
            <View style={styles.profile} />
            <View style={{ flex: 1 }}>
              <Text style={styles.nickname}>{item.nickname}</Text>
              <Text style={styles.chatContent}>{item.content}</Text>
            </View>
            <Pressable onPress={() => { chatRoomCtx.acceptHeart(item.id) }}>
              <View style={styles.acceptButton}>
                <Text style={styles.buttonText}>수락</Text>
              </View>
            </Pressable>
            <Pressable onPress={() => { chatRoomCtx.rejectHeart(item.id) }}>
              <View style={styles.rejectButton}>
                <Text style={styles.buttonText}>거절</Text>
              </View>
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

export default ReceivedHeartPage;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  listContainer: {
    padding: 20,
  },
  listItemContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 10,
    backgroundColor: colors.gray1,
    height: 90,
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
    margin: 25,
  },
  acceptButton: {
    width: 50,
    height: 30,
    justifyContent: "center",
    alignItems: 'center',
    backgroundColor: colors.point,
    borderRadius: 8,
  },
  rejectButton: {
    width: 50,
    height: 30,
    justifyContent: "center",
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: colors.gray6,
    margin: 10,
  },
  buttonText: {
    color: colors.white,
    fontSize: 14,
  }
})