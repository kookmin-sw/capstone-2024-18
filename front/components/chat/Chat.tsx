import React, { useCallback, useContext, useState } from "react";
import { View, Text, StyleSheet, LayoutChangeEvent, Image } from "react-native";
import { colors } from "../../assets/colors";
import { AuthContext } from "../../store/auth-context";
import { UserContext } from "../../store/user-context";
import { formatDailyBorder, formatTime } from "../../util/formatTime";

export interface ChatProps {
  id: string,
  senderId: number,
  senderNickname: string;
  senderGeneratedFaceS3url: string,
  senderOriginFaceS3url: string,
  content: string;
  sendTime: Date;
  isDailyInitial?: boolean;
  isInitial?: boolean;
  isFinal?: boolean;
  setHeight?: (height: number) => void;
}

const Chat = React.memo(({ 
  senderId, 
  senderNickname, 
  senderGeneratedFaceS3url, 
  senderOriginFaceS3url, 
  content, 
  sendTime, 
  isDailyInitial, 
  isInitial, 
  isFinal, 
  setHeight, 
}: ChatProps) => {
  const authCtx = useContext(AuthContext);
  const userCtx = useContext(UserContext);

  const formattedTime = formatTime(sendTime);
  const formattedDailyBorder = formatDailyBorder(sendTime);

  const isSender = senderId === authCtx.userId;
  const defaultProfileUrl = 'https://facefriend-s3-bucket.s3.ap-northeast-2.amazonaws.com/default-faceInfo.png';

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    if (setHeight === undefined) return;
    const { height } = event.nativeEvent.layout;
    // console.log("height:", height);
    if (height !== undefined && height !== null && !isNaN(height)) setHeight(height); 
  }, [isInitial, isFinal, isDailyInitial, setHeight]);

  return (
    <View onLayout={onLayout}>
      {isDailyInitial && 
        <View style={styles.dailyBorderContainer}>
          <View style={styles.dailyBorder}/>
          <Text style={styles.dailyBorderText}>
            {formattedDailyBorder}
          </Text>
        </View>}
      {isInitial && <View style={{ height: 10 }}/>}
      <View style={{ flexDirection : isSender ? "row-reverse" : "row" }}>
      {isInitial && <Image
        source={{ uri: senderGeneratedFaceS3url ? senderGeneratedFaceS3url : defaultProfileUrl }}
        style={[styles.profile, { backgroundColor: colors.white }]}
      />}
      {!isInitial && <View style={styles.profileSpacer}/>}
      <View style={styles.innerContainer}>
        {isInitial && <View style={styles.nicknameContainer}>
          <Text style={[styles.nickname, { textAlign : isSender ? "right" : "left" }]}>{isSender ? userCtx.basicinfo.nickname : senderNickname}</Text>
        </View>}
        <View style={[styles.chatOuterContainer, { flexDirection : isSender ? "row-reverse" : "row" }]}>
          <View style={styles.chatContainer}>
            <Text style={styles.message}>{content}</Text>
          </View>
          {isFinal && <View style={styles.timestampContainer}>
            <Text style={[styles.timestamp, { textAlign : isSender ? "right" : "left" }]}>{formattedTime}</Text>
          </View>}
          </View>
        </View>
        <View style={styles.spacer}/>
      </View>
    </View>
  )
}, (prevProps, nextProps) => {
  return prevProps.isInitial === nextProps.isInitial && prevProps.isFinal === nextProps.isFinal;
});

export default Chat;

const styles = StyleSheet.create({
  outerContainer: {
    flexDirection: "row",
  },
  innerContainer: {
  },
  chatContainer: {
    borderRadius: 12,
    backgroundColor: colors.gray5,
    marginTop: 10,
    maxWidth: 250,
  },
  chatOuterContainer: {
    flexWrap: 'wrap',
    flexDirection : "row-reverse",
  },
  nickname: {
    color: colors.gray9,
    fontFamily: "Pretendard-Regular",
    fontSize: 16,
  },
  nicknameContainer: {
    height: 25,
  },
  timestampContainer: {
    justifyContent: "flex-end",
  },
  profile: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.gray4,
    marginHorizontal: 10,
  },
  profileSpacer: {
    width: 50,
    marginHorizontal: 10,
  },
  message: {
    color: colors.white,
    padding: 8,
    fontSize: 14,
    fontFamily: "Pretendard-Regular",
  },
  timestamp: {
    color: colors.gray9,
    fontSize: 12,
    marginHorizontal: 5,
    fontFamily: "Pretendard-Regular",
  },
  spacer: {
    flex: 1,
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
    fontFamily: "Pretendard-Regular",
  }
})
