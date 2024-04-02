import { View, Text, StyleSheet, useWindowDimensions, TextInput as RNTextInput } from 'react-native';
import { useState } from 'react';
import { colors } from '../assets/colors.tsx';
import CustomButton from '../components/CustomButton.tsx';
import ImageButton from '../components/ImageButton.tsx';

/**
 * 기능 테스트 하고 싶다면, App.tsx에 다음 코드를 넣기
 * import ButtonTestPage from './pages/ButtonTestPage.tsx';
 * 
 * function App() {
 *    return (<ButtonTestPage />);
 * }
 * 
 * export default App;
 */
const ButtonTestPage = () => {
  // google button 크기 조정을 위한 코드
  const [parentWidth, setParentWidth] = useState(0);
  const onLayout = (event: any) => {
    const {width} = event.nativeEvent.layout;
    setParentWidth(width);
  };

  // 로그인 버튼 클릭
  const TryLogin = () => {
    console.log("Login");
  }

  return (
    <View style={styles.container}>
      {/* 이메일 찾기, 비밀번호 찾기 */}
      <View style={[styles.fit_content, {marginBottom: 40}]}>
        <CustomButton onPress={() => {}} type='fit-content'
          containerStyle={{backgroundColor: colors.transparent}}
          textStyle={styles.small_button_text}>이메일 찾기
        </CustomButton>
        <View style={{width: 1, height: '80%', alignSelf: 'center', marginHorizontal: 15, backgroundColor: colors.gray9 }}/>
        <CustomButton onPress={() => {}} type='fit-content'
          containerStyle={{backgroundColor: colors.transparent}}
          textStyle={styles.small_button_text}>비밀번호 찾기
        </CustomButton>
      </View>

      {/* 로그인, 개발자 로그인, 구글 로그인 버튼 */}
      <View style={{marginHorizontal: 30}} onLayout={onLayout}>
        <CustomButton onPress={TryLogin} 
          containerStyle={{marginVertical: 5}}
          textStyle={styles.button_text}>로그인
        </CustomButton>
        <ImageButton onPress={() => {}} 
          containerStyle={{marginVertical: 5}}
          imageProps={{width: parentWidth, source: require('../assets/images/signin-assets/Android/png@4x/neutral/sq_ctn.png')}}/>
      </View>

      {/* 회원가입 */}
      <View style={[styles.fit_content, {marginTop: 10}]}>
        <Text style={{alignSelf: "center", color: colors.gray7}}>아직 회원이 아니신가요? </Text>
        <CustomButton onPress={() => {}} type='fit-content'
          containerStyle={{backgroundColor: colors.transparent, height: 17.25}}
          textStyle={[styles.small_button_text, styles.underline]}>회원가입
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
    alignSelf: 'center',
    flex: 0
  },
  // font style - 밑줄
  underline: {
    borderBottomWidth: 0.5
  }, 
  // button font style
  button_text: {
    fontSize: 18,
    color: colors.white
  }, 
  small_button_text: {
    fontSize: 14,
    color: colors.gray7
  },
});

export default ButtonTestPage;