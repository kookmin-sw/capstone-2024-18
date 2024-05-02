import { Modal, View, Text, Pressable, StyleSheet } from "react-native";
import { colors } from "../assets/colors";
import CustomTextInput from "../components/CustomTextInput";
import CustomButton from "../components/CustomButton";
import { useState } from "react";
import { IconButton } from "react-native-paper";
import { sendCode, verifyCode } from "../util/auth";

interface Email {
  value: string;
  status: string; 
  message: string;
}

interface Props {
  email: Email;
  setModalVisible: (visivle: boolean) => void;
  setEmail: (email: Email) => void;
}

const VerifyEmailModal = ({email, setModalVisible, setEmail}: Props) => {
  const [code, setCode] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  const handleVerifyCodeChange = (value: string) => {
    setCode(value);
  }

  const isFormValid = code.length === 6;

  const handleSendCode = async () => {
    setModalMessage("인증번호를 발송 중입니다.");
    const response = await sendCode(email.value);
    setModalMessage(response.message);
  }

  const handleSubmit = async () => {
    setEmail({...email, status: "LOADING", message: "인증 확인 중입니다."});
    setModalMessage("인증 확인 중입니다.");
    const response = await verifyCode(email.value, code);
    if ("isVerified" in response)  {
      if (response.isVerified) {
        setEmail({...email, status: "VERIFIED", message: response.message});
        setModalMessage(response.message);
        setModalVisible(false);
        return;
      }
    }
    setEmail({...email, status: "INVALID", message: response.message});
    setModalMessage(response.message);
  }

  const handleClose = () => {
    setModalVisible(false)
  }

  return (
    <Modal
        animationType="slide"
        visible={true}>
      <View style={{right: 0}}>
        <IconButton icon="close" onPress={handleClose}/>
      </View>
      <View style={styles.container}>
        <View style={styles.sectionContainer}>
          <Text style={styles.title}>이메일 인증하기</Text>
          <View style={[styles.textContainer, {height: 50}]}>
            <Text style={styles.inputLabel}>{modalMessage}</Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.inputLabel}>인증번호 입력</Text>
            <Text style={styles.inputLabelStar}> *</Text>
          </View>
          <CustomTextInput placeholder="XXXXXX" onChangeText={handleVerifyCodeChange}/>
        </View>
        <CustomButton onPress={handleSendCode} 
          containerStyle={styles.pointButton}
          textStyle={styles.pointButtonText}>인증번호 발송
        </CustomButton>
        <CustomButton onPress={handleSubmit} containerStyle={[styles.pointButton, { backgroundColor: isFormValid ? colors.point : colors.pastel_point }]}
          textStyle={styles.pointButtonText}>인증번호 입력
        </CustomButton>
      </View>
    </Modal>
  )
}

export default VerifyEmailModal;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 60,
    paddingHorizontal: 45,
    flex: 1
  },
  title: {
    color: colors.gray7,
    fontSize: 24,
    fontFamily: "Pretendard-SemiBold",
    alignSelf: "center",
    marginBottom: 50,
  },
  textContainer: {
    flexDirection: "row", 
    marginTop: 6,
  },
  inputLabel: {
    fontSize: 14, 
    color: colors.point, 
    letterSpacing: -14 * 0.04,
    fontFamily: "Pretendard-SemiBold",
  },
  inputLabelStar: {
    fontSize: 16, 
    color: colors.gray6,
    fontFamily: "Pretendard-Regular",
  },
  sectionContainer: {
    borderBottomColor: colors.gray3,
    borderBottomWidth: 1,
    paddingHorizontal: 12,
    paddingTop: 9,
    paddingBottom: 12,
    flexDirection: 'column',
    flex: 1,
  },
  pointButton: {
    backgroundColor: colors.point, 
    height: 50, 
    borderRadius: 10, 
    justifyContent: "center", 
    marginTop: 21,
    shadowColor: colors.gray4
  },
  pointButtonText: {
    color: colors.white, 
    fontWeight: "400", 
    fontSize: 18, 
    textAlign: "center",
    letterSpacing: -18 * 0.02, 
  },
})