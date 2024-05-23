import { Alert } from "react-native";

export const createAlertMessage = (message: string, onConfirm?: () => void) => {
  Alert.alert(
    "알림",
    message,
    [{ text: "확인", style: "cancel", onPress: onConfirm }],
    { cancelable: true },
  );
}