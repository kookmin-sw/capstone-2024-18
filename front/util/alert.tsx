import { Alert } from "react-native";

export const createAlertMessage = (message: string, onPress?: ()=>void) => {
  Alert.alert(
    "알림",
    message,
    [{ text: "확인", style: "cancel", onPress: onPress }],
    { cancelable: true },
  );
}