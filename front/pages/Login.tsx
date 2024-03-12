import { View, Button, Text, TextInput, StyleSheet, useWindowDimensions } from 'react-native';
import { useState, useRef } from 'react';
import logo from '../assets/images/logo_origin.png';
import AutoHeightImage from 'react-native-auto-height-image';


const colors = {
  gray: "#DEDEDE",
  black: "#000000",
  white: "#FFFFFF",
  point: "#FF6161"
};
const styles = StyleSheet.create({
  container: {
    margin: 12
  },
  margin: {
    marginBottom: 10
  },
  input: {
    height: 40,
    borderBottomWidth: 0.5,
    paddingLeft: 5,
    paddingTop: 5,
    padding: 5,
  },
  image: {
    alignItems: 'center',
    padding: 50
  },
  button: {
    marginTop: 17,
    fontSize: 60,
  },
  login: {
    color: colors.black
  },
  fit_content: {
    flexDirection: 'row', 
  }
});

// Button에 직접 Style 적용 불가능. View를 이용하여 버튼 새로 구현해야함
const Start = () => {
  const [ userData, setUserData ] = useState({
    email: '',
    password: ''
  })
  const {width} = useWindowDimensions();
  const passwordRef = useRef<TextInput | null>(null);

  const handleChangeText = (key: string, value: string) => {
    setUserData({
      ...userData,
      [key]: value,
    })
  }
  const handleSubmit = () => {
    console.log("Login");
  }
  const handleSubmitDeveloper = () => {
    console.log("Login with Developer mode");
  }
  const checkEmail = () => {
    if (userData.email.includes("@")) {
      console.log("contain @")
    } else {
      console.log("not contain @")
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.image}>
       <AutoHeightImage width={width * 0.6} source={logo}/>
      </View>
      <View>
        <Text style={styles.login}>이메일 주소</Text>
        <TextInput 
          style={[styles.input, styles.margin]} 
          placeholderTextColor={colors.gray}
          value={userData.email}
          returnKeyType='next'
          onSubmitEditing={() => {passwordRef.current?.focus();}}
          onEndEditing={checkEmail}
          keyboardType="email-address"
          onChangeText={text => handleChangeText("email", text)}
          placeholder='ex) FaceFriend@gmail.com'/>
        <Text style={styles.login}>비밀번호</Text>
        <TextInput 
          style={[styles.input, styles.margin]}
          secureTextEntry={true}
          ref={passwordRef}
          value={userData.password}
          returnKeyType='send'
          onSubmitEditing={handleSubmit}
          onChangeText={text => handleChangeText("password", text)}
          placeholderTextColor={colors.gray}
          placeholder='Password'/>
        <View style={[styles.button, styles.margin]}>
          <Button color={colors.point} title="로그인" onPress={handleSubmit}/> 
        </View>
        <View style={[styles.button, {marginTop: 0, marginBottom: 20}]}>
          <Button color={colors.point} title="개발자 로그인" onPress={handleSubmitDeveloper}/> 
        </View>
      </View>
      <View style={styles.fit_content}>
        <Text style={{flex: 1, textAlign: 'center'}}>이메일 가입</Text>
        <View style={{borderWidth: 0.5}}/>
        <Text style={{flex: 1, textAlign: 'center'}}>이메일 찾기</Text>
        <View style={{borderWidth: 0.5}}/>
        <Text style={{flex: 1, textAlign: 'center'}}>비밀번호 찾기</Text>
      </View>
    </View>
  );
};

export default Start;