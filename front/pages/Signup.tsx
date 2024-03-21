import { useEffect, useState, useRef } from "react";
import { View, StyleSheet, Text, Pressable, ScrollView, TextInput } from "react-native";
import { Icon } from 'react-native-paper';

import IconText from "../Components/IconText.tsx";
import CustomTextInput from "../Components/CustomTextInput.tsx";
import CustomButton from "../Components/CustomButton.tsx";

import { colors } from '../assets/colors.tsx'

const Signup = () => {
  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState("NOT_CHECKED");

  const [pwInput, setPwInput] = useState(["", ""]);
  const [pwStatus, setPwStatus] = useState("NOT_CHECKED");
  const [pwVisible, setPwVisible] = useState([false, false]);

  const [nickname, setNickname] = useState("");

  const [isChecked, setIsChecked] = useState([false, false]);
  const isCheckedAll = isChecked.every(checked => checked === true);

  const [agreementToggle, setAgreementToggle] = useState(false);

  const [isFormValid, setIsFormValid] = useState(false);

  const passwordInputRef = useRef<TextInput>(null);
  const passwordConfirmInputRef = useRef<TextInput>(null);
  const nicknameInputRef = useRef<TextInput>(null);

  const handleEmailInputChange = (value: string) => {
    setEmail(value);
  }

  const handleEmailValidation = () => {
    const emaliRegex = /^[\w.-]+@[\w.-]+\.\w+$/;
    if (emaliRegex.test(email)) setEmailStatus("VALID");
    else setEmailStatus("INVALID");
  }

  const handlePwInputChage = (value: string, index: number) => {
    setPwInput(pwInput.map((item, i) => i === index ? value : item));
  }

  const togglePwVisibility = (index: number) => {
    setPwVisible(pwVisible.map((item, i) => i === index ? !item : item));
  }

  const handleNicknameInputChage = (value: string) => {
    setNickname(value);
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

  const handleSubmit = () => {
    if (isFormValid) console.log(email, pwInput[0], nickname);
  }

  useEffect(() => {
    if (pwInput[0] === "" || pwInput[1] === "") setPwStatus("NOT_CHECKED");
    else if (pwInput[0] === pwInput[1]) {
      const pwRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*+=-])[A-Za-z\d!@#$%^&*+=-]{8,16}$/;
      if (pwRegex.test(pwInput[0])) setPwStatus("VALID");
      else setPwStatus("INVALID");
    }
    else setPwStatus("NOT_MATCH");
  }, [pwInput])

  useEffect(() => {
    if (emailStatus === "VALID" && pwStatus === "VALID" && nickname && isCheckedAll) setIsFormValid(true);
    else setIsFormValid(false);
  }, [emailStatus, pwStatus, nickname, isCheckedAll, setIsFormValid, isFormValid])

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <View style={styles.sectionContainer}>
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
            />
          </View>
          <View style={styles.grayButtonContainer}>
            <CustomButton onPress={handleEmailValidation} styles={styles.grayButton}>
              <Text style={styles.grayButtonText}>이메일 중복 확인</Text>
            </CustomButton>
            {emailStatus === "NOT_CHECKED" ? "" 
            : emailStatus === "INVALID" ? 
              <IconText icon={{source: "close-circle"}} containerStyle={{ marginLeft: 10 }}>올바른 이메일 주소가 아닙니다</IconText>
            : emailStatus === "VALID" ? 
              <IconText icon={{source: "check-circle"}} containerStyle={{ marginLeft: 10 }}>확인되었습니다</IconText>            
            : // emailStatus === "INVALID"
              <IconText icon={{source: "close-circle"}} containerStyle={{ marginLeft: 10 }}>중복 이메일입니다</IconText>
            }
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
              secureTextEntry={pwVisible[0]} 
              onChangeText={(newText) => handlePwInputChage(newText, 0)}
              rightIcon={{ source: pwVisible[0] ? "eye-off-outline" : "eye-outline" }} 
              rightPressable={{ onPress: togglePwVisibility.bind(this, 0) }}
              ref={passwordInputRef}
              returnKeyType="next"
              onSubmitEditing={() => passwordConfirmInputRef.current?.focus()}
              blurOnSubmit={false}
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
              secureTextEntry={pwVisible[1]} 
              onChangeText={(newText) => handlePwInputChage(newText, 1)}
              rightIcon={{ source: pwVisible[1] ? "eye-off-outline" : "eye-outline" }} 
              rightPressable={{ onPress: togglePwVisibility.bind(this, 1) }}
              ref={passwordConfirmInputRef}
              returnKeyType="next"
              onSubmitEditing={() => nicknameInputRef.current?.focus()}
              blurOnSubmit={false}
            />
          </View>
          {pwStatus === "NOT_CHECKED" ? 
            <View style={[styles.hintContainer, {height: 12}]} />
          : pwStatus === "NOT_MATCH" ? 
            <IconText icon={{source: "close-circle"}} containerStyle={styles.hintContainer}>일치하지 않습니다</IconText>
          : pwStatus === "VALID" ? 
            <IconText icon={{source: "check-circle"}} containerStyle={styles.hintContainer}>일치합니다</IconText>
          : // pwStatus === "INVALID"
            <IconText icon={{source: "close-circle"}} containerStyle={styles.hintContainer}>영문 숫자 특수문자 혼합 8-16자여야 합니다</IconText>
          }
        </View>
        <View style={[styles.sectionContainer, { minHeight: 145 }]}>
          <View style={styles.textContainer}>
            <Text style={styles.inputLabel}>닉네임</Text>
            <Text style={styles.inputLabelStar}> *</Text>
          </View>
          <View style={styles.textInputContainer}>
            <CustomTextInput
              ref={nicknameInputRef}
              placeholder="예) Anna" onChangeText={handleNicknameInputChage}  
            />
          </View>
        </View>
        <View style={[styles.sectionContainer, { borderBottomWidth: 0 }]}>
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
    paddingHorizontal: 45,
    flex: 1,
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
  },
  grayButtonContainer: {
    marginTop: 8,
    flexDirection: "row",
    alignItems:"center",
  },
  grayButton: {
    backgroundColor: colors.gray6, 
    width: 110, 
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