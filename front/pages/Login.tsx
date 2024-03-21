import { View, Text, StyleSheet, TextInput as RNTextInput } from 'react-native';
import { useRef, useState } from 'react';
import AutoHeightImage from 'react-native-auto-height-image';
import { colors } from '../assets/colors.tsx';
import CustomButton from '../components/CustomButton.tsx';
import CustomText from '../components/CustomText.tsx';
import CustomTextInput from '../components/CustomTextInput.tsx';

const Login = () => {
  const [ email, setEmail ] = useState('');
  const [ pw, setPw ] = useState('');

  const passwordRef = useRef<RNTextInput | null>(null);
  const [ secure, setSecure ] = useState(true);

  // google button 크기 조정을 위한 코드
  const [parentWidth, setParentWidth] = useState(0);
  const onLayout = (event: any) => {
    const {width} = event.nativeEvent.layout;
    setParentWidth(width);
  }

  // 로그인 버튼 클릭
  const TryLogin = (develop_mode=false) => {
    if (develop_mode) {
      // 개발자용 id, password로 로그인
    }

    console.log("Login");
  }

  return (
    <View style={{height: '100%'}}>
      <View style={styles.container}>
        <AutoHeightImage
          width={parentWidth}
          style={{alignSelf:"center", marginHorizontal: 80}}
          source={require('../assets/images/logo_origin.png')}
        />

        <CustomText style={{alignSelf: "center", fontSize: 24, color: colors.point, paddingTop: 30, paddingBottom: 10}}>
          LOGIN
        </CustomText>

        <View style={styles.textInputContainer}>
          <CustomTextInput
            leftIcon={{source: "email"}} 
            placeholder="이메일을 입력해주세요" 
            onChangeText={(text) => setEmail(text)}
            keyboardType='email-address'
            returnKeyType='next'
            onSubmitEditing={() => {passwordRef.current?.focus()}}
            textInputStyle={{paddingLeft: 10, marginVertical: 3}}
          />
        </View>
        <View style={styles.textInputContainer}>
          <CustomTextInput
            leftIcon={{source: "lock"}} 
            rightIcon={{source: secure ?  "eye-off-outline" : "eye-outline"}}
            rightPressable={{ onPress: () => setSecure(!secure) }}
            placeholder="비밀번호를 입력해주세요" 
            onChangeText={(text) => setPw(text)}
            secureTextEntry={secure}
            ref={passwordRef}
            textInputStyle={{paddingLeft: 10, marginVertical: 3}}
          />
        </View>

        {/* 이메일 찾기, 비밀번호 찾기 */}
        <View style={[styles.fit_content, {marginBottom: 40}]}>
          <CustomButton onPress={() => {}} styles={{backgroundColor: colors.transparent, ...styles.fit_button}}>
            <CustomText style={styles.small_button_text}>이메일 찾기</CustomText>
          </CustomButton>
          <View style={{borderWidth: 0.5, marginHorizontal: 10, marginVertical: 10}}/>
          <CustomButton onPress={() => {}} styles={{backgroundColor: colors.transparent, ...styles.fit_button}}>
            <CustomText style={styles.small_button_text}>비밀번호 찾기</CustomText>
          </CustomButton>
        </View>

        {/* 로그인, 개발자 로그인, 구글 로그인 버튼 */}
        <View style={{marginHorizontal: 30}} onLayout={onLayout}>
          <CustomButton onPress={TryLogin} styles={{backgroundColor: colors.point, marginVertical: 5}}>
            <CustomText style={styles.button_text}>로그인</CustomText>
          </CustomButton>
          {/* <CustomButton onPress={() => {TryLogin(true)}} styles={{backgroundColor: colors.point, marginVertical: 5}} >
            <CustomText style={styles.button_text}>개빌지 로그인</CustomText>
          </CustomButton> */}
          <CustomButton onPress={() => {}} styles={{backgroundColor: colors.white, marginVertical: 5, padding: 0}} >
            <AutoHeightImage width={parentWidth} source={require('../assets/images/signin-assets/Android/png@4x/neutral/sq_ctn.png')}/>
          </CustomButton>
        </View>

        {/* 회원가입 */}
        <View style={[styles.fit_content]}>
          <Text style={{alignSelf: "center", color: colors.gray7}}>아직 회원이 아니신가요? </Text>
          <CustomButton onPress={() => {}} styles={{backgroundColor: colors.transparent, ...styles.fit_button}}>
            <CustomText style={{...styles.small_button_text, ...styles.underline}}>회원가입</CustomText>
          </CustomButton>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: "14%",
    flex: 1,
    justifyContent: 'center'
  },
  // 클릭 가능한 text를 위한 설정(custom button 파일 사용)
  fit_content: {
    paddingTop: 10,
    flexDirection: 'row', 
    alignSelf: 'center'
  },
  fit_button: {
    padding: 5, 
    flex: 0
  },
  // font style - 밑줄
  underline: {
    borderBottomWidth: 0.6,
    color: colors.gray7
  }, 
  // button font style
  small_button_text: {
    fontSize: 14,
    color: colors.gray7
  },
  button_text: {
    fontSize: 18,
    color: colors.white
  }, 

  text_input: {
    marginVertical: 5
  },
  textInputContainer: {
    marginTop: 10,
  },
});

export default Login;