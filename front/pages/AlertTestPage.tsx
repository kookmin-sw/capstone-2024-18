import { Button, StyleSheet, View } from "react-native";
import CustomButton from "../components/CustomButton";
import { useState } from 'react';
import CustomAlert from "../components/CustomAlert";

const AlertTestPage = () => {
  const [isAlertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const showAlert = (message: string) => {
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const closeAlert = () => {
    setAlertVisible(false);
  };
  
  return (
    <View style={styles.container}>
      <Button title="Show Custom Alert" onPress={() => showAlert('채팅방에서 나가시겠습니까?')} />
      <CustomAlert isVisible={isAlertVisible} message={alertMessage} onClose={closeAlert} onConfirm={closeAlert}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});

export default AlertTestPage;