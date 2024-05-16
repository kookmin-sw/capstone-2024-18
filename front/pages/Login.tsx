import { useRef, useState, useContext } from 'react';
import { View, Text, StyleSheet, TextInput as RNTextInput, TouchableOpacity, BackHandler, Alert, ScrollView, useWindowDimensions } from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';
import CustomButton from '../components/CustomButton.tsx';
import ImageButton from '../components/ImageButton.tsx';
import CustomTextInput from '../components/CustomTextInput.tsx';
import { AuthContext } from '../store/auth-context.tsx';

import { SvgUri } from 'react-native-svg';
import EmailIcon from '../assets/images/email.svg';

import { colors } from '../assets/colors.tsx';
import { isErrorResponse, isValidResponse } from '../util/auth.tsx';
import { createAlertMessage } from '../util/alert.tsx';
import CustomBackHandler from '../components/CustomBackHandler.tsx';

const Login = ({navigation}: any) => {
  const authCtx = useContext(AuthContext);
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
  const tryLogin = async () => {
    const response = await authCtx.signin(email, pw);

    if (isValidResponse(response)) {
      console.log("tryLogin: isValidResponse");
      navigation.navigate('Home');
    }
    if (isErrorResponse(response)) {
      console.log("tryLogin: isErrorResponse");
      createAlertMessage(response.message);
    }
  }

  return (
    <ScrollView contentContainerStyle={{height: '100%'}}>
      <CustomBackHandler haveExit={true}/>
      <View style={styles.container}>
        <AutoHeightImage
          width={240}
          style={{alignSelf:"center"}}
          source={require('../assets/images/logo.png')}/>

        <Text style={{alignSelf: "center", fontSize: 24, color: colors.point, paddingTop: 60, paddingBottom: 10, fontFamily: "Pretendard-SemiBold", fontWeight: "600"}}>
          LOGIN
        </Text>

        <View style={styles.textInputContainer}>
          {/* <EmailIcon width="50px" height="50px" /> */}
          <CustomTextInput
            leftIcon={{source: require('../assets/images/email.png'), size: 18, color: colors.point}} 
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
            leftIcon={{source: require("../assets/images/pw.png"), size: 18, color: colors.point}} 
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
          <TouchableOpacity onPress={() => {navigation.navigate('FindEmail')}} style={{backgroundColor: colors.transparent}}>
            <Text style={styles.small_button_text}>이메일 찾기</Text>
          </TouchableOpacity>
          <View style={{width: 1.5, height: '80%', alignSelf: 'center', marginHorizontal: 15, backgroundColor: colors.gray9 }}/>
          <TouchableOpacity onPress={() => {navigation.navigate('FindPw')}} style={{backgroundColor: colors.transparent}}>
            <Text style={styles.small_button_text}>비밀번호 찾기</Text>
          </TouchableOpacity>
        </View>

        {/* 로그인, 구글 로그인 버튼 */}
        <View style={{marginHorizontal: 30}} onLayout={onLayout}>
          <CustomButton onPress={tryLogin} 
            containerStyle={{backgroundColor: colors.point, marginVertical: 5, elevation: 4}}
            textStyle={styles.button_text}>
            로그인하기
          </CustomButton>
          {/* <ImageButton onPress={() => {}} borderRadius={10}
            imageProps={{width: parentWidth, source: require('../assets/images/signin-assets/Android/png@4x/neutral/sq_ctn.png')}}
            containerStyle={{marginVertical: 5}}/> */}
        </View>

        {/* 회원가입 */}
        <View style={[styles.fit_content, {marginTop: 10}]}>
          <Text style={styles.small_button_text}>아직 회원이 아니신가요? </Text>
          <TouchableOpacity onPress={() => {navigation.navigate('Signup')}} style={{backgroundColor: colors.transparent, height: 17.25, marginLeft: 5}}>
            <Text style={[styles.small_button_text, styles.underline]}>회원가입</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 46,
    backgroundColor: colors.white
  },
  // 클릭 가능한 text를 위한 설정(custom button 파일 사용)
  fit_content: {
    paddingTop: 10,
    flexDirection: 'row', 
    alignSelf: 'center'
  },
  // font style - 밑줄
  underline: {
    textDecorationLine: "underline",
  }, 
  // button font style
  small_button_text: {
    fontSize: 14,
    fontFamily: "Pretendard-Regular",
    letterSpacing: -14 * 0.02,
    color: colors.gray7
  },
  button_text: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: "Pretendard-SemiBold",
    letterSpacing: -18 * 0.02,
    color: colors.white,
  }, 
  textInputContainer: {
    marginTop: 10,
  },
});

export default Login;