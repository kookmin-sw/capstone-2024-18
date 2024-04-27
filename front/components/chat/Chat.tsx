import React, { useCallback } from "react";
import { View, Text, StyleSheet, LayoutChangeEvent } from "react-native";
import { colors } from "../../assets/colors";

export interface ChatProps {
  message: string;
  nickname: string;
  uuid: string;
  id: number;
  timestamp: Date;
  isInitial?: boolean;
  isFinal?: boolean;
}

const UUID = "0";

const Chat = React.memo(({ message, nickname, uuid, timestamp, isInitial, isFinal }: ChatProps) => {
  const date = new Date(timestamp);
  const hours = date.getHours(); 
  const minutes = date.getMinutes(); 
  const AMorPM = hours < 12 ? "오전" : "오후";
  const formattedTime = `${AMorPM} ${hours % 12}:${minutes.toString().padStart(2, '0')}`;

  const onLayoutHandler = (event: LayoutChangeEvent) => {
    const {x, y, width, height} = event.nativeEvent.layout;
    console.log("X position: ", x);
    console.log("Y position: ", y);
    console.log("Width: ", width);
    console.log("Height: ", height);
  };

  return (
    <View style={{ flexDirection : uuid == UUID ? "row-reverse" : "row" }}>
      <View style={isInitial ? styles.profile : styles.profileSpacer}/>
      <View style={styles.innerContainer}>
        {isInitial && <View style={styles.nicknameContainer}>
          <Text style={[styles.nickname, { textAlign : uuid == UUID ? "right" : "left" }]}>{nickname}</Text>
        </View>}
        <View style={[styles.chatOuterContainer, { flexDirection : uuid == UUID ? "row-reverse" : "row" }]}>
          <View style={styles.chatContainer}>
            <Text style={styles.message}>{message}</Text>
          </View>
          {isFinal && <View style={styles.timestampContainer}>
            <Text style={[styles.timestamp, { textAlign : uuid == UUID ? "right" : "left" }]}>{formattedTime}</Text>
          </View>}
        </View>
      </View>
      <View  onLayout={onLayoutHandler} style={styles.spacer}/>
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
    color: "black",
  },
  nicknameContainer: {
    height: 20
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
  },
  timestamp: {
    color: colors.gray9,
    fontSize: 12,
    marginHorizontal: 5,
  },
  spacer: {
    flex: 1,
  }
})
