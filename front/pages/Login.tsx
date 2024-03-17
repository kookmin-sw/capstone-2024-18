import { View, Text, StyleSheet, useWindowDimensions, TextInput as RNTextInput, Image } from 'react-native';
import { useRef, useState } from 'react';
import AutoHeightImage from 'react-native-auto-height-image';
import { colors } from '../assets/colors.tsx';
import { TextInput} from 'react-native-paper';
import CustomButton from '../components/CustomButton.tsx';
import CustomText from '../components/CustomText.tsx';

const Login = () => {
  const [ userData, setUserData ] = useState({
    email: '',
    password: ''
  })
  const passwordRef = useRef<RNTextInput | null>(null);
  const [ secure, setSecure ] = useState(true);

  // google button 크기 조정을 위한 코드
  const [parentWidth, setParentWidth] = useState(0);
  const onLayout = (event: any) => {
    const {width} = event.nativeEvent.layout;
    setParentWidth(width);
  };

  // 로그인 버튼 클릭
  const TryLogin = (develop_mode=false) => {
    if (develop_mode) {
      // 개발자용 id, password로 로그인
    }

    console.log("Login");
  }

  return (
    <View style={styles.container}>
      <AutoHeightImage
        width={parentWidth}
        style={{alignSelf:"center", margin: 80}}
        source={require('../assets/images/logo_origin.png')}
      />

      <CustomText style={{alignSelf: "center", fontSize: 24, color: colors.point, paddingBottom: 30}}>
        LOGIN
      </CustomText>

      <TextInput
        style={{backgroundColor: colors.gray1, height: 50, fontSize: 16, color: colors.gray8, marginVertical: 5}}
        value={userData.email}
        onChangeText={(text) => {setUserData({...userData, "email": text})}}
        keyboardType='email-address'

        returnKeyType='next'
        onSubmitEditing={() => {passwordRef.current?.focus()}}

        placeholder='이메일을 입력해주세요'
        left={
          <TextInput.Icon
            icon={() => 
              <Image style={{width: 30, height: 30}} source={require('../assets/images/email.png')}/>
            }
          />
        }
      />
      <TextInput
        style={{backgroundColor: colors.gray1, height: 50, fontSize: 16, color: colors.gray8, marginVertical: 5}}
        value={userData.password}
        onChangeText={(text) => {setUserData({...userData, "password": text})}}

        ref={passwordRef}
        
        placeholder='비밀번호를 입력해주세요'
        secureTextEntry={secure}
        left={
          <TextInput.Icon
            icon={() => 
              <Image style={{width: 20, height: 20}} source={require('../assets/images/pw.png')}/>
            }
          />
        }
        right={
          <TextInput.Icon
            icon={() => 
              (secure) ? 
                <Image source={require('../assets/images/eye-off.png')}/> : 
                <Image source={require('../assets/images/eye.png')}/>
            }
            onPress={() => {setSecure(!secure)}}
          />
        }
      />

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
      <View style={[styles.fit_content, {marginTop: 10}]}>
        <Text style={{alignSelf: "center", color: colors.gray7}}>아직 회원이 아니신가요? </Text>
        <CustomButton onPress={() => {}} styles={{backgroundColor: colors.transparent, ...styles.fit_button}}>
          <CustomText style={{...styles.small_button_text, ...styles.underline}}>회원가입</CustomText>
        </CustomButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: "14%"
  },
  // 클릭 가능한 text를 위한 설정(custom button 파일 사용)
  fit_content: {
    flexDirection: 'row', 
    alignSelf: 'center'
  },
  fit_button: {
    padding: 5, 
    flex: 0
  },
  // font style - 밑줄
  underline: {
    borderBottomWidth: 0.5
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
});

export default Login;