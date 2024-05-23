import { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';

import { colors } from '../assets/colors.tsx';
import CustomTextInput from '../components/CustomTextInput.tsx';
import CustomButton from '../components/CustomButton.tsx';
import { findEmail, isErrorResponse, isFindEmailResponse } from "../util/auth.tsx";
import IconText from '../components/IconText.tsx';
import HeaderBar from '../components/HeaderBar.tsx';
import CustomBackHandler from '../components/CustomBackHandler.tsx';
import { AlertContext } from '../store/alert-context.tsx';


const FindEmail = ({navigation}: any) => {
  const { createAlertMessage } = useContext(AlertContext);
  
  const {height} = useWindowDimensions();
  
  // email state 관리와 
  const [email, setEmail] = useState({
    value: "",
    status: "",
    message: "",
  });
  const [isFormValid, setIsFormValid] = useState(false);

  const handleEmailInputChange = (value: string) => {
    setEmail({...email, value});
  }

  // email 유효성 검사. focus out시 실행
  const handleEmailInputOnBlur = async () => {
    if (email.value === "") {
      setEmail({...email, status: ""});
      return;
    }
  }

  useEffect(() => {
    const emaliRegex = /^[\w.-]+@[\w.-]+\.\w+$/;
    if (emaliRegex.test(email.value)) {
      setEmail({...email, status: "VALID", message: "올바른 이메일 형식입니다."});
    } else {
      setEmail({...email, status: "INVALID", message: "이메일 형식이 아닙니다."});
    }
  }, [email.value])

  const emailHintText = 
    <View style={styles.hintContainer}>{
      email.status === "" ? "" 
    : email.status === "VALID" ? 
      <IconText icon={{ source: "check-circle" }}>{email.message}</IconText>
    : // email.status === "INVALID" 
      <IconText icon={{ source: "close-circle", color: colors.point }} textStyle={{ color: colors.point }}>{email.message}</IconText>
    }</View>;

  // 이메일 찾기 api
  const handleSubmit = async () => {
    console.log("submit", isFormValid);

    const response = await findEmail(email.value);

    if (isFindEmailResponse(response)) {
      createAlertMessage(response.message, () => navigation.goBack());
    } 
    if (isErrorResponse(response)){ // 나머지 에러
      createAlertMessage(response.message);
    }
  }

  useEffect(() => {
    if (email.status === "VALID") setIsFormValid(true);
    else setIsFormValid(false);
  }, [email.status])

  return (
    <ScrollView contentContainerStyle={{height: height}}>
      <HeaderBar onPress={navigation.goBack}>이메일 찾기</HeaderBar>
      <CustomBackHandler onBack={navigation.goBack}/>
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <Text style={styles.helperText}>이메일을 입력해주세요</Text>
          <Text style={styles.smallHelperText}>가입 시 등록했던 이메일을 입력하면 가입 여부를 알려드려요.</Text>

          <View style={styles.textInputContainer}>
            <CustomTextInput 
              placeholder="예) facefriend@gmail.com" 
              onChangeText= {handleEmailInputChange} 
              blurOnSubmit={false}
              returnKeyType="next"
              onBlur={handleEmailInputOnBlur}
              isValid={email.status === "VALID" || email.status === "LOADING" || email.status === ""}
            />
            {emailHintText}
          </View>
        </View>
        <View style={styles.bottomContainer}>
          <CustomButton 
            onPress={handleSubmit} disabled={!isFormValid}
            containerStyle={[styles.pointButton, { backgroundColor: isFormValid ? colors.point : colors.pastel_point }]}
            textStyle={styles.pointButtonText}>이메일 찾기
          </CustomButton>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    paddingHorizontal: 32,
    paddingTop: 33,  
    backgroundColor: colors.white
  },
  innerContainer: {
    paddingHorizontal: 8,
    alignItems: "center",
    flex: 1,
  },
  helperText: {
    alignSelf: 'center', 
    textAlign: 'center',
    fontFamily: "Pretendard-Medium",
    fontSize: 16,
    letterSpacing: -16 * 0.02, 
    paddingBottom: 12
  },
  hintContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
    marginTop: 8,
    marginBottom: 4,
    height: 18,
  },
  smallHelperText: {
    alignSelf: 'center', 
    textAlign: 'center',
    fontFamily: "Pretendard-Regular",
    fontSize: 14,
    letterSpacing: -14 * 0.02, 
    paddingBottom: 30
  },
  textInputContainer: {
    marginTop: 6,
    flex: 1
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
    fontFamily: "Pretendard-SemiBold",
    fontWeight: "400", 
    fontSize: 18, 
    textAlign: "center",
    letterSpacing: -18 * 0.02, 
  },
  bottomContainer: {
    alignItems: "center",
    marginBottom: 46,
    paddingHorizontal: 8,
  },
});

export default FindEmail;