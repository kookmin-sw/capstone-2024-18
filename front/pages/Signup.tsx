import { useEffect, useState, useRef } from "react";
import { View, StyleSheet, Text, Pressable, ScrollView, TextInput } from "react-native";
import { Icon } from 'react-native-paper';
import { useNavigate } from "react-router-native";

import IconText from "../components/IconText.tsx";
import CustomTextInput from "../components/CustomTextInput.tsx";
import CustomButton from "../components/CustomButton.tsx";

import { colors } from '../assets/colors.tsx'
import { signup, verifyDuplicationEmail } from "../util/auth.tsx";
import { createAlertMessage } from "../util/alert.tsx";

import VerifyEmailModal from "./VerifyEmailModal.tsx";

const Signup = () => {
  const navigate = useNavigate();
  const [modalVisible, setModalVisible] = useState(false);
  const [emailStatus, setEmailStatus] = useState("NOT_CHECKED");

  const [email, setEmail] = useState({
    value: "",
    status: "",
    message: "",
  });

  const [password, setPassword] = useState({
    value: ["", ""],
    status: "",
    visible: [false, false],
    message: "",
    isFocused: false,
  });
  
  const [isChecked, setIsChecked] = useState([false, false]);
  const isCheckedAll = isChecked.every(checked => checked === true);

  const [agreementToggle, setAgreementToggle] = useState(false);

  const [isFormValid, setIsFormValid] = useState(false);

  const passwordInputRef = useRef<TextInput>(null);
  const passwordConfirmInputRef = useRef<TextInput>(null);

  const handleModalOpen = () => {
    if (email.status === "VALID") {
      setModalVisible(true);
    }
  }

  const handleEmailInputChange = (value: string) => {
    setEmail({...email, value});
  }

  const handleEmailInputOnBlur = async () => {
    if (email.value === "") {
      setEmail({...email, status: ""});
      return;
    }

    setEmail({...email, status: "LOADING", message: "중복 확인 중입니다."});

    const emaliRegex = /^[\w.-]+@[\w.-]+\.\w+$/;
    if (emaliRegex.test(email.value)) {
      const response = await verifyDuplicationEmail(email.value);
      if (response.status === 200) {
        setEmail({...email, status: "VALID", message: response.message});
      } else {
        setEmail({...email, status: "INVALID", message: response.message});
      }
    } 
    else {
      setEmail({...email, status: "INVALID", message: "이메일 형식이 아닙니다."});
    }
  }

  const handlePwInputChage = (value: string, index: number) => {
    setPassword(prevPassword => ({
      ...prevPassword, 
      value: prevPassword.value.map((item, i) => i === index ? value : item)
    }));
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

  const handleAgreementToggle = () => {
    setAgreementToggle(!agreementToggle);
  }

  const handleCheck = (index: number) => {
    setIsChecked(isChecked.map((item, i) => i === index ? !item : item));
  } 

  const handleCheckAll = () => {
    if (isCheckedAll) {
      setIsChecked([...isChecked].fill(false));
    }
    else setIsChecked([...isChecked].fill(true));
  } 

  const handleSubmit = async () => {
    if (!isFormValid) return;
    const response = await signup(email.value, password.value[0], password.value[1], email.status === "VERIFIED");
    createAlertMessage(response.message);
    navigate('/');
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
  }, [password.value, password.isFocused])

  useEffect(() => {
    console.log(email.status, password.status, isCheckedAll);
    if (email.status === "VERIFIED" && password.status === "VALID" && isCheckedAll) setIsFormValid(true);
    else setIsFormValid(false);
  }, [email.status, password.status, isCheckedAll])

  const emailHintText = 
    <View style={styles.hintContainer}>{
      email.status === "" ? "" 
    : email.status === "VERIFIED" || email.status === "VALID" ? 
      <IconText icon={{ source: "check-circle" }}>{email.message}</IconText>
    : email.status === "NOT_CHECKED" || email.status === "INVALID" ? 
        <IconText icon={{ source: "close-circle", color: colors.point }} textStyle={{ color: colors.point }}>{email.message}</IconText>
    : // email.status === "LOADING" 
      <IconText icon={{ source: "loading" }}>{email.message}</IconText>
    }</View>

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
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, padding: 45 }}>
      {modalVisible && <VerifyEmailModal setModalVisible={setModalVisible} email={email} setEmail={setEmail}/>}
      <View style={styles.container}>
        <View style={[styles.sectionContainer, { borderTopWidth: 0 }]}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>SIGN UP</Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.inputLabel}>이메일 주소</Text>
            <Text style={styles.inputLabelStar}> *</Text>
          </View>
          <View style={styles.textInputContainer}>
            <CustomTextInput 
              placeholder="예) facefriend@gmail.com" 
              onChangeText= {handleEmailInputChange} 
              returnKeyType="next"
              onSubmitEditing={() => passwordInputRef.current?.focus()}
              blurOnSubmit={false}
              onBlur={handleEmailInputOnBlur}
              isValid={email.status === "VALID" || email.status === "VERIFIED" || email.status === "LOADING" || email.status === ""}
            />
          </View>
          <View style={styles.grayButtonContainer}>
            <CustomButton onPress={handleModalOpen} styles={styles.grayButton}>
              <Text style={styles.grayButtonText}>본인인증</Text>
            </CustomButton>
            {emailHintText}
          </View>
        </View>
        <View style={styles.sectionContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.inputLabel}>비밀번호 설정</Text>
            <Text style={styles.inputLabelStar}> *</Text>
          </View>
          <View style={styles.textInputContainer}>
            <CustomTextInput 
              placeholder='비밀번호를 입력해주세요'
              secureTextEntry={!password.visible[0]} 
              onChangeText={(newText) => handlePwInputChage(newText, 0)}
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
              onChangeText={(newText) => handlePwInputChage(newText, 1)}
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
          <View style={styles.agreementContainer}>
            <Pressable onPress={handleCheckAll}>
              <Icon source={isCheckedAll ? "checkbox-marked" : "checkbox-outline"} color={colors.gray6} size={18} /> 
            </Pressable>
            <Text style={styles.agreementText}>이용약관 전체 동의</Text>
            <View style={styles.toggleIconContainer}>
              <Pressable onPress={handleAgreementToggle}>
                <Icon source={agreementToggle ? "chevron-up" : "chevron-down"} color={colors.gray6} size={24} /> 
              </Pressable>
            </View>
          </View>
          {agreementToggle && 
          <>
            <View style={styles.subagreementContainer}>
              <Pressable onPress={handleCheck.bind(this, 0)}>
                <Icon source={isChecked[0] ? "checkbox-marked" : "checkbox-outline"} color={colors.gray6} size={18} /> 
              </Pressable>
              <Text style={styles.subagreementText}>[필수] 만 14세 이상이며 모두 동의합니다.</Text>
              <Text style={styles.subagreementToggleText}>전체</Text>
            </View>
            <View style={styles.subagreementContainer}>
              <Pressable onPress={handleCheck.bind(this, 1)}>
                <Icon source={isChecked[1] ? "checkbox-marked" : "checkbox-outline"} color={colors.gray6} size={18} /> 
              </Pressable>
              <Text style={styles.subagreementText}>[필수] 만 14세 이상이며 모두 동의합니다.</Text>
              <Text style={styles.subagreementToggleText}>전체</Text>
            </View>
          </>}
          <CustomButton onPress={handleSubmit} styles={StyleSheet.flatten([styles.pointButton, { backgroundColor: isFormValid ? colors.point : colors.pastel_point }])}>
            <Text style={styles.pointButtonText}>회원가입하기</Text>
          </CustomButton>
        </View>
      </View>
    </ScrollView>
  )
}

export default Signup;

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