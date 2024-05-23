import { View, Text, ScrollView, StyleSheet, Dimensions, StyleProp, ViewStyle, Image, useWindowDimensions } from 'react-native';
import { colors } from '../../assets/colors.tsx'
import React from 'react';
import RenderHtml from 'react-native-render-html';
import AutoHeightImage from 'react-native-auto-height-image';
import HeaderBar from '../../components/HeaderBar.tsx';
import CustomBackHandler from '../../components/CustomBackHandler.tsx';


const Banner1 = ({ navigation }: any) => {
  const {width, height} = useWindowDimensions();
  const bannerContents = `<span style='color: ${colors.gray7};'>
    <span style='color: ${colors.point};'>FACE FRIEND</span> 는 기존의 데이팅앱에서 새로운 사람을 만나기 위해 가치관, 배경, 성격, 취미, 신체조건 등 <span style='color: ${colors.point};'>수많은 정보들을 번거롭게 작성</span>해야만 한다는 문제 의식에서 출발했어요. <br><br>
    또한, 기존의 데이팅앱에서는 사용자의 실제 얼굴 이미지를 기반으로 서비스가 운영되기 때문에 <span style='color: ${colors.point};'>다수의 사용자들에게 본인의 얼굴을 노출하기 부담</span>스러울 수 있다는 문제의식 또한 느꼈어요.<br><br>
    데이팅앱의 목적상 정보들과 얼굴 이미지를 등록하는 것은 필수적이었기 때문에, <span style='color: ${colors.point};'>FACE FRIEND</span> 는 이 문제를 어떻게 창의적으로 해결할 수 있을지 고민했어요. <br><br>
    FACE FRIEND 가 떠올린 방법은 바로 <span style='color: ${colors.point};'>관상</span>이에요! 실제 얼굴 이미지 대신 <span style='color: ${colors.point};'>관상 이미지</span>를 사용한다면 얼굴 노출의 부담을 덜 수 있을 것이고, 수많은 정보를 <span style='color: ${colors.point};'>관상 정보</span>로 대체한다면 수많은 정보를 작성하는 번거로움을 줄일 수 있을거라고 생각했어요! <span style='color: ${colors.point};'>관상 이미지</span>와 <span style='color: ${colors.point};'>관상 정보</span>를 보며 상대의 실제 얼굴, 실제 성격을 유추해가는 즐거움은 덤이구요!<br><br>
    <span style='color: ${colors.point};'>FACE FRIEND</span> 에서 제공하는 <span style='color: ${colors.point};'>AI 관상 이미지, AI 관상 분석, AI 관상 궁합 추천</span> 등의 기능을 통해 새로운 사람과 더 쉽고, 즐겁게 만날 수 있을거라 생각해요.<br><br>
    물론 <span style='color: ${colors.point};'>FACE FRIEND</span> 에서는 관상 이미지와 관상 정보 이외에도 <span style='color: ${colors.point};'>기본정보</span>과 <span style='color: ${colors.point};'>자기소개서</span> 등으로 상대에 대해 더 자세히 알아볼 수 있으니 이것들을 참고해도 좋아요!<br><br>
    더 이상 새로운 사람을 만나는 것에 망설이지 마세요!<br><span style='color: ${colors.point};'>FACE FRIEND</span> 가 더 좋은 사람을 만날 수 있도록 도와드릴테니 말이죠! 😎<br></span>`;
  
  return(
    <ScrollView contentContainerStyle={{backgroundColor: colors.white}}>
      <CustomBackHandler onBack={navigation.goBack}/>
      <HeaderBar onPress={navigation.goBack}>상세보기</HeaderBar>
      <AutoHeightImage width={width} source={require(`../../assets/images/banner1.png`)}/>
      <View style={styles.container}>
        <View style={{flexDirection: 'row', paddingVertical: 20}}>
          <AutoHeightImage
            width={width/4}
            source={require('../../assets/images/logo.png')}/>
          <Text style={styles.bigText}>를 소개합니다!</Text>
        </View>
        <RenderHtml defaultTextProps={{style: styles.smallText}} source={{html: bannerContents}}/>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 32,
    flex: 1,
    backgroundColor: colors.white,
  },
  bigText: {
    fontFamily: "Pretendard-Bold", 
    fontSize: 25, 
    textAlignVertical: 'bottom',
    paddingBottom: 10,
    paddingLeft: 10,
    color: colors.gray9,
  },
  smallText: {
    fontFamily: "Pretendard-Regular", 
    fontSize: 14, 
  }
});

export default Banner1;