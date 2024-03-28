import { Modal, View, Text, Pressable, StyleSheet } from "react-native";
import { colors } from "../assets/colors";
import CustomTextInput from "../components/CustomTextInput";
import CustomButton from "../components/CustomButton";
import { useState } from "react";
import { IconButton } from "react-native-paper";
import { sendCode, verifyCode } from "../util/auth";

interface Props {
  email: string;
  setModalVisible: (visivle: boolean) => void;
  setEmailStatus: (status: string) => void;
  setEmailMessage: (message: string) => void;
}

const VerifyEmailModal = ({email, setModalVisible, setEmailStatus, setEmailMessage}: Props) => {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');

  const handleVerifyCodeChange = (value: string) => {
    setCode(value);
  }

  const isFormValid = code.length === 6;

  const handleSendCode = () => {
    setMessage(email+"로 인증번호가 발송되었습니다.");
    sendCode(email);
  }

  const handleSubmit = async () => {
    setEmailStatus("CHECKED");
    setEmailMessage("인증되었습니다.");
    setModalVisible(false);
    const response = await verifyCode(email, code);
  }

  const handleClose = () => {
    setModalVisible(false)
  }

  return (
    <Modal
        animationType="slide"
        visible={true}
      >
      <View style={{right: 0}}>
        <IconButton icon="close" onPress={handleClose}/>
      </View>
        <View style={styles.container}>
          <View style={styles.sectionContainer}>
            <Text style={styles.title}>이메일 인증하기</Text>
            <View style={[styles.textContainer, {height: 50}]}>
              <Text style={styles.inputLabel}>{message}</Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.inputLabel}>인증번호 입력</Text>
              <Text style={styles.inputLabelStar}> *</Text>
            </View>
            <CustomTextInput placeholder="XXXXXX" onChangeText={handleVerifyCodeChange}/>
          </View>
          <CustomButton onPress={handleSendCode} styles={styles.pointButton}>
            <Text style={styles.pointButtonText}>인증번호 발송</Text>
          </CustomButton>
          <CustomButton onPress={handleSubmit} styles={StyleSheet.flatten([styles.pointButton, { backgroundColor: isFormValid ? colors.point : colors.pastel_point }])}>
            <Text style={styles.pointButtonText}>인증번호 입력</Text>
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