import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TextInput } from 'react-native';

import { colors } from '../assets/colors.tsx';
import CustomBackHandler from '../components/CustomBackHandler.tsx';
import CustomTextInput from '../components/CustomTextInput.tsx';
import CustomButton from '../components/CustomButton.tsx';
import { createAlertMessage } from '../util/alert.tsx';
import { isErrorResponse, isValidResponse, sendTemporaryPassword, verifyTemporaryPassword } from "../util/auth.tsx";
import IconText from '../components/IconText.tsx';
import HeaderBar from '../components/HeaderBar.tsx';


const FindPw = ({navigation}: any) => {
  const height = Dimensions.get('window').height;
  const [pageIndex, setPageIndex] = useState(0);

  const [email, setEmail] = useState({
    value: "",
    status: "",
    message: "",
  });
  const [tempPassword, setTempPassword] = useState({
    value: "",
    status: "",
    visible: false,
    message: "",
  });
  const [password, setPassword] = useState({
    value: ["", ""],
    status: "",
    visible: [false, false],
    message: "",
    isFocused: false,
  });
  const passwordInputRef = useRef<TextInput>(null);
  const passwordConfirmInputRef = useRef<TextInput>(null);

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

  const handlTempPwInputChange = (value: string) => {
    setTempPassword(prevPassword => ({
      ...prevPassword,
      value: value
    }))
  }
  const handlePwInputChange = (value: string, index: number) => {
    setPassword(prevPassword => ({
      ...prevPassword, 
      value: prevPassword.value.map((item, i) => i === index ? value : item)
    }));
  }

  const toggleTempPwVisibility = () => {
    setTempPassword({...tempPassword, visible: !tempPassword.visible})
  }

  const togglePwVisibility = (index: number) => {
    setPassword(prevPassword => ({
      ...prevPassword,
      visible: prevPassword.visible.map((isVisible, i) => i === index ? !isVisible : isVisible)
    }));
  }

  const handleOnFocus = () => {
    setPassword({...password, isFocused: true});
  }

  const handleOnBlur = () => {
    setPassword({...password, isFocused: false});
  }

  const emailHintText = 
    <View style={styles.hintContainer}>{
      email.status === "" ? "" 
    : email.status === "VALID" ? 
      <IconText icon={{ source: "check-circle" }}>{email.message}</IconText>
    : // email.status === "INVALID" 
      <IconText icon={{ source: "close-circle", color: colors.point }} textStyle={{ color: colors.point }}>{email.message}</IconText>
    }</View>

  const handleSubmit = async () => {
    if (!isFormValid) return;

    if (pageIndex === 0) { // 인증코드 전송 요청
      const response = await sendTemporaryPassword(email.value);
      if (isValidResponse(response)) {
        createAlertMessage(response.message, () => setPageIndex(1));
      }
      if (isErrorResponse(response)) {
        createAlertMessage(response.message);
      }
    } else { // 비밀번호 재설정
      const response = await verifyTemporaryPassword(email.value, tempPassword.value, password.value[0], password.value[1]);
      
      if (isValidResponse(response)) {
        createAlertMessage(response.message, () => navigation.goBack());
      }
      if (isErrorResponse(response)) {
        createAlertMessage(response.message);
      }
    }
  }

  function onBack() {
    if (pageIndex === 0) navigation.goBack();
    else setPageIndex(0);
  }

  useEffect(() => {
    if (email.status === "VALID") setIsFormValid(true);
    else setIsFormValid(false);
  }, [email.status, password.status])

  useEffect(() => {
    if (password.status === "VALID") setIsFormValid(true);
    else setIsFormValid(false);
  }, [password.status])

  useEffect(() => {
    if (password.value[0] === "" || password.value[1] === "") {
      setPassword({...password, status: "", message: ""});
    }
    else if (password.value[0] === password.value[1]) {
      const pwRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*+=-])[A-Za-z\d!@#$%^&*+=-]{8,16}$/;
      if (pwRegex.test(password.value[0])) {
        setPassword({...password, status: "VALID", message: "비밀번호가 일치합니다."});
      }
      else {
        setPassword({...password, status: "INVALID", message: "비밀번호 형식을 만족하지 않습니다."});
      }
    }
    else setPassword({...password, status: "NOT_MATCH", message: "비밀번호가 일치하지 않습니다."});
  }, [password.value, password.isFocused])

  useEffect(() => {
    setEmail({...email, status: ""});
    setIsFormValid(false);
  }, [pageIndex])

  const passwordHintText = 
    <View style={styles.hintContainer}>{
      password.status === "" ? "" 
    : password.status === "VALID" ? 
      <IconText icon={{ source: "check-circle" }}>{password.message}</IconText>
    : // password.status === "INVALID" || password.status === "NOT_MATCH"
      <IconText 
        icon={{ source: "close-circle", color: password.isFocused ? colors.gray6 : colors.point }} 
        textStyle={{ color: password.isFocused ? colors.gray6 : colors.point }}
      >
        {password.message}
      </IconText>
    }</View>

  const findPw = 
    <View style={{flex: 1}}>
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
    </View>;
  
  const resetPw = 
    <View style={{flex: 1}}>
      <View style={styles.sectionContainer}>
        <Text style={styles.smallHelperText}>전송받은 인증코드와 새로 설정할 비밀번호를 {'\n'} 입력해주시기 바랍니다.</Text>
        <View style={styles.textContainer}>
          <Text style={styles.inputLabel}>인증코드</Text>
          <Text style={styles.inputLabelStar}> *</Text>
        </View>
        <View style={styles.textInputContainer}>
          <CustomTextInput 
            placeholder='인증코드를 입력해주세요'
            secureTextEntry={!tempPassword.visible} 
            onChangeText={(newText) => handlTempPwInputChange(newText)}
            rightIcon={{ source: !tempPassword.visible ? "eye-off-outline" : "eye-outline" }} 
            rightPressable={{ onPress: toggleTempPwVisibility }}
            returnKeyType="next"
            onSubmitEditing={() => passwordInputRef.current?.focus()}
            blurOnSubmit={false}
            isValid={tempPassword.status === "" || tempPassword.status === "VALID"}
            onFocus={handleOnFocus}
            onBlur={handleOnBlur}
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.inputLabel}>새 비밀번호</Text>
          <Text style={styles.inputLabelStar}> *</Text>
        </View>
        <View style={styles.textInputContainer}>
          <CustomTextInput 
            placeholder='비밀번호를 입력해주세요'
            secureTextEntry={!password.visible[0]} 
            onChangeText={(newText) => handlePwInputChange(newText, 0)}
            rightIcon={{ source: !password.visible[0] ? "eye-off-outline" : "eye-outline" }} 
            rightPressable={{ onPress: togglePwVisibility.bind(this, 0) }}
            ref={passwordInputRef}
            returnKeyType="next"
            onSubmitEditing={() => passwordConfirmInputRef.current?.focus()}
            blurOnSubmit={false}
            isValid={password.status === "" || password.status === "VALID" || password.isFocused}
            onFocus={handleOnFocus}
            onBlur={handleOnBlur}
          />
        </View>
        <IconText icon={{source: "information"}} containerStyle={styles.hintContainer}>영문 숫자 특수문자 혼합 8-16자</IconText>
        <View style={styles.textContainer}>
          <Text style={styles.inputLabel}>새 비밀번호 확인</Text>
          <Text style={styles.inputLabelStar}> *</Text>
        </View>
        <View style={styles.textInputContainer}>
          <CustomTextInput 
            placeholder='비밀번호를 입력해주세요'
            secureTextEntry={!password.visible[1]} 
            onChangeText={(newText) => handlePwInputChange(newText, 1)}
            rightIcon={{ source: !password.visible[1] ? "eye-off-outline" : "eye-outline" }} 
            rightPressable={{ onPress: togglePwVisibility.bind(this, 1) }}
            ref={passwordConfirmInputRef}
            returnKeyType="done"
            isValid={password.status === "" || password.status === "VALID" || password.isFocused}
            onFocus={handleOnFocus}
            onBlur={handleOnBlur}
          />
        </View>
        {passwordHintText}
      </View>
    </View>;
  
  const contents = [
    findPw,
    resetPw
  ]

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ height: height}}>
      <CustomBackHandler onBack={onBack}/>
      <HeaderBar onPress={onBack}>비밀번호 찾기</HeaderBar>
      <View style={styles.container}>
        {contents[pageIndex]}

        <View style={styles.bottomContainer}>
          <CustomButton 
            onPress={handleSubmit} disabled={!isFormValid}
            containerStyle={StyleSheet.flatten([styles.pointButton, { backgroundColor: isFormValid ? colors.point : colors.pastel_point }])}
            textStyle={styles.pointButtonText}>{(pageIndex===0) ? "비밀번호 찾기" : "비밀번호 재설정 완료"}
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
  helperText: {
    alignSelf: 'center', 
    textAlign: 'center',
    fontFamily: "Pretendard-Medium",
    fontSize: 16, 
    letterSpacing: -16 * 0.02, 
    paddingBottom: 12
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
    paddingHorizontal: 8
  },
  hintContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
    marginTop: 8,
    marginBottom: 4,
    height: 18
  },

  // 비밀번호 재설정 컨텐츠
  sectionContainer: {
    borderTopColor: colors.gray3,
    paddingHorizontal: 12,
    paddingTop: 9,
    paddingBottom: 12,
  },
  titleContainer: {
    alignItems: "center", 
    marginTop: 23,
    marginBottom: 16,
  },
  title: {
    fontSize: 24, 
    color: colors.point, 
    fontFamily: "Pretendard-SemiBold",
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

  // 버튼
  pointButton: {
    backgroundColor: colors.point, 
    height: 50, 
    borderRadius: 10, 
    justifyContent: "center", 
    marginTop: 21,
    shadowColor: colors.gray4,
    elevation: 4
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

export default FindPw;