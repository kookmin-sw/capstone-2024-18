import { KeyboardAvoidingView, StyleSheet } from "react-native";
import CustomTextInput from "../CustomTextInput";
import { useState } from "react";

interface Props {
  sendChat: (text: string) => void;
}

const ChatInput = ({ sendChat }: Props) => {
  const [message, setMessage] = useState("");

  const handleSendChat = () => {
    if (!message) return;
    console.log("handleSendChat:", message);
    sendChat(message);
    setMessage("");
  }

  const handleChangeText = (value: string) => {
    setMessage(value);
  }

  return (
    <CustomTextInput 
      rightIcon={{ source: "send" }} 
      value={message} 
      onChangeText={handleChangeText} 
      rightPressable={{ onPress: handleSendChat }}
      onSubmitEditing={handleSendChat}
      blurOnSubmit={false}
    />
  )
}

export default ChatInput;

const styles = StyleSheet.create({
  container: {
    
  }
})