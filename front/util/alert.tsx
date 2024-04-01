import { Alert } from "react-native";

export const createAlertMessage = (message: string) => {
  Alert.alert(
    "알림",
    message,
    [{ text: "확인", style: "cancel" }],
    { cancelable: true },
  );
}