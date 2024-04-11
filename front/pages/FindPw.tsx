import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useNavigate } from "react-router-native";

import { colors } from '../assets/colors.tsx';
import CustomBackHandler from '../components/CustomBackHandler.tsx';
import CustomTextInput from '../components/CustomTextInput.tsx';
import CustomButton from '../components/CustomButton.tsx';
import { createAlertMessage } from '../util/alert.tsx';
import { sendTemporaryPassword } from "../util/auth.tsx";
import IconText from '../components/IconText.tsx';


const FindPw = () => {
  const height = Dimensions.get('window').height;
  const navigate = useNavigate();

  const [email, setEmail] = useState({
    value: "",
    status: "",
    message: "",
  });
  const [isFormValid, setIsFormValid] = useState(false);

  const handleEmailInputChange = (value: string) => {
    setEmail({...email, value});
  }

  const handleEmailInputOnBlur = async () => {
    console.log("check email")

    if (email.value === "") {
      setEmail({...email, status: ""});
      return;
    }

    const emaliRegex = /^[\w.-]+@[\w.-]+\.\w+$/;
    if (emaliRegex.test(email.value)) {
      setEmail({...email, status: "VALID", message: "올바른 이메일 형식입니다"});
    } 
    else {
      setEmail({...email, status: "INVALID", message: "이메일 형식이 아닙니다."});
    }
  }

  const emailHintText = 
    <View style={styles.hintContainer}>{
      email.status === "" ? "" 
    : email.status === "VALID" ? 
      <IconText icon={{ source: "check-circle" }}>{email.message}</IconText>
    : email.status === "INVALID" ? 
      <IconText icon={{ source: "close-circle", color: colors.point }} textStyle={{ color: colors.point }}>{email.message}</IconText>
    : // email.status === "LOADING"
      <IconText icon={{ source: "loading" }}>{email.message}</IconText>
    }</View>

  const handleSubmit = async () => {
    if (!isFormValid) return;

    const response = await sendTemporaryPassword(email.value);
    if (response.status === 200) {
      createAlertMessage(response.message, () => navigate('/resetpw', {state: {email: email.value}}));
    } else if (response.status === 404) {
      createAlertMessage('404 오류');
    } else {
      createAlertMessage(response.message);
    }
  }

  useEffect(() => {
    console.log(email.status);
    if (email.status === "VALID") setIsFormValid(true);
    else setIsFormValid(false);
  }, [email.status])

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, padding: 45, minHeight: height}}>
      <CustomBackHandler onBack={() => navigate('/')}/>
      <View style={styles.container}>
        <Text style={styles.helperText}>이메일을 입력해주세요</Text>
        <Text style={styles.smallHelperText}>가입 시 등록했던 이메일로 임시 비밀번호를 전송해드립니다. 이메일을 받으셨다면 비밀번호를 재설정해주시길 바랍니다</Text>

        <View style={styles.textInputContainer}>
          <CustomTextInput 
            placeholder="예) facefriend@gmail.com" 
            onChangeText= {handleEmailInputChange} 
            blurOnSubmit={false}
            returnKeyType="next"
            onBlur={handleEmailInputOnBlur}
            isValid={email.status === "VALID" || email.status === ""}
          />
        </View>
        {emailHintText}
      </View>

      <CustomButton 
        onPress={handleSubmit}
        containerStyle={StyleSheet.flatten([styles.pointButton, { backgroundColor: isFormValid ? colors.point : colors.pastel_point }])}
        textStyle={styles.pointButtonText}>비밀번호 찾기
      </CustomButton>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  helperText: {
    alignSelf: 'center', 
    textAlign: 'center',
    fontSize: 16, 
    letterSpacing: -16 * 0.02, 
    paddingBottom: 12
  },
  smallHelperText: {
    alignSelf: 'center', 
    textAlign: 'center',
    fontSize: 14,
    letterSpacing: -14 * 0.02, 
    paddingBottom: 30
  },
  textInputContainer: {
    marginTop: 6,
  },
  hintContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
    marginTop: 8,
    marginBottom: 4,
    height: 18,
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
});

export default FindPw;