import { useEffect, useState, useRef } from "react";
import { View, StyleSheet, Text, ScrollView, TextInput, Dimensions } from "react-native";
import { useLocation, useNavigate } from "react-router-native";

import IconText from "../components/IconText.tsx";
import CustomTextInput from "../components/CustomTextInput.tsx";
import CustomButton from "../components/CustomButton.tsx";

import { colors } from '../assets/colors.tsx'
import { verifyTemporaryPassword } from "../util/auth.tsx";
import { createAlertMessage } from "../util/alert.tsx";
import CustomBackHandler from "../components/CustomBackHandler.tsx";


const ResetPw = () => {
  const height = Dimensions.get('window').height;
  const navigate = useNavigate();
  const location = useLocation();

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
  
  const [isFormValid, setIsFormValid] = useState(false);

  const passwordInputRef = useRef<TextInput>(null);
  const passwordConfirmInputRef = useRef<TextInput>(null);

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

  const handleSubmit = async () => {
    if (!isFormValid) return;

    const response = await verifyTemporaryPassword(location.state.email, tempPassword.value, password.value[0], password.value[1]);
    createAlertMessage(response.message, () => navigate('/'));
  }
  
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

    console.log(password.value)
  }, [password.value, password.isFocused])

  useEffect(() => {
    if (password.status === "VALID") setIsFormValid(true);
    else setIsFormValid(false);
  }, [password.status])

  const passwordHintText = 
    <View style={styles.hintContainer}>{
      password.status === "" ? "" 
    : password.status === "VALID" ? 
      <IconText icon={{ source: "check-circle" }}>{password.message}</IconText>
    : // password.status === "INVALID || password.status === NOT_MATCH"
      <IconText 
        icon={{ source: "close-circle", color: password.isFocused ? colors.gray6 : colors.point }} 
        textStyle={{ color: password.isFocused ? colors.gray6 : colors.point }}
      >
        {password.message}
      </IconText>
    }</View>
  
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, padding: 45, minHeight: height }}>
      <CustomBackHandler onBack={() => navigate('/')}/>
      
      <View style={styles.container}>
        <View style={[styles.sectionContainer, { borderTopWidth: 0 }]}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>SIGN UP</Text>
          </View>
        </View>
        <View style={styles.sectionContainer}>

          <View style={styles.textContainer}>
            <Text style={styles.inputLabel}>인증코드</Text>
            <Text style={styles.inputLabelStar}> *</Text>
          </View>
          <View style={styles.textInputContainer}>
            <CustomTextInput 
              placeholder='비밀번호를 입력해주세요'
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
            <Text style={styles.inputLabel}>비밀번호 설정</Text>
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
            <Text style={styles.inputLabel}>비밀번호 확인</Text>
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
        <View style={[styles.sectionContainer, { borderBottomWidth: 0, marginTop: 'auto' }]}>
          <CustomButton onPress={handleSubmit} 
            containerStyle={StyleSheet.flatten([styles.pointButton, { backgroundColor: isFormValid ? colors.point : colors.pastel_point }])}
            textStyle={styles.pointButtonText}>비밀번호 재설정 완료
          </CustomButton>
        </View>
      </View>
    </ScrollView>
  )
}

export default ResetPw;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 24, 
    color: colors.point, 
    fontFamily: "Pretendard-SemiBold",
  },
  titleContainer: {
    alignItems: "center", 
    marginTop: 23,
    marginBottom: 16,
  },
  textContainer: {
    flexDirection: "row", 
    marginTop: 6,
  },
  textInputContainer: {
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
  hintContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
    marginTop: 8,
    marginBottom: 4,
    height: 18,
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
  sectionContainer: {
    borderTopColor: colors.gray3,
    borderTopWidth: 1,
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
  agreementContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  agreementCheckbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: colors.gray6,
  },
  agreementText: {
    color: colors.gray6,
    fontSize: 14,
    marginLeft: 10,
    flex: 1,
    fontFamily: "Pretendard-Medium",
    letterSpacing: -14 * 0.03,
  },
  subagreementContainer: {
    flexDirection: "row",
    marginTop: 6,
    marginLeft: 24,
    overflow: "hidden",
  },
  subagreementText: {
    color: colors.gray6,
    fontSize: 12,
    marginLeft: 10,
    flex: 1,
    fontFamily: "Pretendard-Regular",
    letterSpacing: -12 * 0.04, 
  },
  subagreementToggleText: {
    color: colors.gray4,
    fontSize: 12,
    fontFamily: "Pretendard-Regular",
    textDecorationLine: "underline",
    letterSpacing: -12 * 0.04, 
  },
  toggleIconContainer: {
    overflow: "hidden", 
    alignItems: "center", 
    height: 18,
  }
})