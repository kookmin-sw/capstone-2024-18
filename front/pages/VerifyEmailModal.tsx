import { Modal, View, Text, Pressable, StyleSheet, useWindowDimensions, ScrollView } from "react-native";
import { colors } from "../assets/colors";
import CustomTextInput from "../components/CustomTextInput";
import CustomButton from "../components/CustomButton";
import { useEffect, useState } from "react";
import { IconButton } from "react-native-paper";
import { sendCode, verifyCode } from "../util/auth";
import HeaderBar from "../components/HeaderBar";

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

  const {height} = useWindowDimensions();

  const handleVerifyCodeChange = (value: string) => {
    setCode(value);
  }

  const isFormValid = code.length === 6;

  const handleSendCode = async () => {
    await sendCode(email.value);
  }

  const handleSubmit = async () => {
    setEmail({...email, status: "LOADING", message: "인증 확인 중입니다."});
    const response = await verifyCode(email.value, code);
    if ("isVerified" in response)  {
      if (response.isVerified) {
        setEmail({...email, status: "VERIFIED", message: response.message});
        setModalVisible(false);
        return;
      }
    }
    setEmail({...email, status: "INVALID", message: response.message});
  }

  const handleClose = () => {
    setModalVisible(false)
  }

  useEffect(() => {
    console.log("send code");
    handleSendCode();
  }, [])

  return (
    <Modal animationType="slide" visible={true}>
      <ScrollView contentContainerStyle={{height: height}}>
        <HeaderBar onPress={handleClose}>SIGNUP</HeaderBar>
        <View style={styles.container}>
          <View style={styles.sectionContainer}>
            <View style={{alignItems: 'center', paddingBottom: 30}}>
              <Text>인증코드를 입력해주세요</Text>
              <Text style={{textAlign: 'center'}}>{`${email.value}으로 전송된 인증코드를 확인해주세요`}</Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.inputLabel}>인증번호 입력</Text>
              <Text style={styles.inputLabelStar}> *</Text>
            </View>
            <CustomTextInput placeholder="인증코드를 입력해주세요" onChangeText={handleVerifyCodeChange}
              rightIcon={{source: <Text>Vv</Text>}}
            />
            <View style={styles.grayButtonContainer}>
              <CustomButton onPress={handleSendCode} 
                containerStyle={styles.grayButton}
                textStyle={styles.grayButtonText}>코드 재전송
              </CustomButton>
            </View>
            <View style={{flex: 1}}/>
          </View>
          <View style={styles.bottomContainer}>
            <CustomButton onPress={handleSubmit} 
              containerStyle={[styles.pointButton, { backgroundColor: isFormValid ? colors.point : colors.pastel_point }]}
              textStyle={styles.pointButtonText}>인증하기
            </CustomButton>
          </View>
        </View>
      </ScrollView>
    </Modal>
  )
}

export default VerifyEmailModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32, 
    backgroundColor: colors.white
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
    paddingTop: 30,
    paddingBottom: 12,
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
  grayButtonContainer: {
    marginTop: 8,
    flexDirection: "row",
    alignItems:"center",
  },
  grayButton: {
    backgroundColor: colors.gray6, 
    width: 80, 
    height: 30, 
    borderRadius: 6, 
    justifyContent: "center",
    padding: 0,
    flex: 0,
  },
  grayButtonText: {
    color: colors.white, 
    fontSize: 12, 
    fontFamily: "Pretendard-SemiBold",
    textAlign: "center",
    letterSpacing: -12 * 0.02,
  },
  bottomContainer: {
    alignItems: "center",
    marginBottom: 46,
    paddingHorizontal: 8,
  },
})