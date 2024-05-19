import { View, Text, ScrollView, StyleSheet, Dimensions, StyleProp, ViewStyle, Image, useWindowDimensions } from 'react-native';
import { colors } from '../../assets/colors.tsx'
import React from 'react';
import RenderHtml from 'react-native-render-html';
import AutoHeightImage from 'react-native-auto-height-image';
import HeaderBar from '../../components/HeaderBar.tsx';
import CustomBackHandler from '../../components/CustomBackHandler.tsx';


const Banner2 = ({ navigation }: any) => {
  const {width, height} = useWindowDimensions();
  const bannerContents = [
    `<span style='color: ${colors.gray7};'><span style='color: ${colors.point};'>FACE FRIEND</span> 는 <span style='color: ${colors.point};'>관상</span>을 정확히 분석하기 위해 관상 관련 서적 및 논문에 근거하여 관상 규칙을 만들었어요.<br><br> <span style='color: ${colors.point};'>FACE FRIEND</span> 가 정확한 <span style='color: ${colors.point};'>관상 분석</span>을 위해 어떤 방법을 택했는지 간단히 설명드릴게요! <br><br>사용자가 얼굴 사진을 업로드하면 AI는 이를 인식하고 각 얼굴 요소들에 <span style='color: ${colors.point};'>랜드마크</span>를 생성해요. 여기서 랜드마크란, 점으로 얼굴 요소들을 표시하는 것이라고 생각하면 돼요. </span>`,
    `<span style='color: ${colors.gray7};'>사진에서 <span style='color: ${colors.point};'>눈썹, 눈, 코, 입, 얼굴형</span>에 여러 개의 점들이 찍힌 것을 확인할 수 있을 거예요!<br><br> 각 얼굴 부위에 표시된 <span style='color: ${colors.point};'>랜드마크들간의 너비, 높이, 비율</span> 등을 측정하고, 해당 수치가 <span style='color: ${colors.point};'>한국인 평균 수치</span>보다 얼마나 벗어나있는지 <span style='color: ${colors.point};'>표준편차</span>를 판단하여 얼굴 요소의 유형을 정했어요. <br><br>표준편차에 따라 얼굴 요소의 유형을 정하고, 해당 유형을 관련 서적 및 논문에 따라 관상 유형과 매칭했어요. <br><br>위 관상 분석 과정을 <span style='color: ${colors.point};'>“얼굴형”</span>을 예시로 들어 간단히 설명해드릴게요.</span>`,
    `<span style='color: ${colors.gray7};'>얼굴의 가로폭의 비율을 1로 했을 때, 이마 가로폭과 턱 가로폭의 비율을 각각 계산하여 각 평균에서 뺀 오차를 모두 합해 얼굴형을 판단합니다.<br><br> 이마 가로폭이 평균보다 크고, 턱 가로폭이 평균보다 작다면, <span style='color: ${colors.point};'>“역삼각형 얼굴형”</span>입니다. <br><br>이는 <span style='color: ${colors.point};'>五형의 관상 중 “목”</span>에 해당합니다.</span>`,
    `<span style='color: ${colors.gray7};'>어떤가요? <span style='color: ${colors.point};'>FACE FRIEND</span> 의 관상 분석 원리에 대해 이해가 되었을까요? 관상 분석에 대해 궁금한 사항이 있다면 개발팀에게 언제든지 문의해주세요!</span>`,
  ];
  
  return(
    <ScrollView contentContainerStyle={{backgroundColor: colors.white}}>
      <CustomBackHandler onBack={navigation.goBack}/>
      <HeaderBar onPress={navigation.goBack}>상세보기</HeaderBar>
      <AutoHeightImage width={width} source={require(`../../assets/images/banner2.png`)}/>
      <View style={styles.container}>
        <View style={{flexDirection: 'row', paddingTop: 20}}>
          <AutoHeightImage
            width={width/4}
            source={require('../../assets/images/logo.png')}/>
          <Text style={styles.bigText}>의</Text>
        </View>
        <Text style={[styles.bigText, {paddingBottom: 20}]}>관상 분석을 소개합니다!</Text>
        <RenderHtml defaultTextProps={{style: styles.smallText}} source={{html: bannerContents[0]}}/>
        <View style={{flexDirection: 'row', flex: 1, paddingVertical: 20}}>
          <View style={{flex: 1, alignItems: 'center'}}>
            <AutoHeightImage
              width={width/3}
              source={require('../../assets/images/landmark_before.png')}/>
          </View>
          <View style={{flex: 1, alignItems: 'center'}}>
            <AutoHeightImage
              width={width/3}
              source={require('../../assets/images/landmark_after.png')}/>
          </View>
        </View>
        <RenderHtml defaultTextProps={{style: styles.smallText}} source={{html: bannerContents[1]}}/>
        <View style={{marginVertical: 20}}>
          <View style={styles.boxTitleContainer}>
            <Text style={styles.titleText}>얼굴형 분석 규칙</Text>
          </View>
          <View style={styles.boxContainer}>
            <RenderHtml defaultTextProps={{style: styles.smallText}} source={{html: bannerContents[2]}}/>
          </View>
        </View>
        <RenderHtml defaultTextProps={{style: styles.smallText}} source={{html: bannerContents[3]}}/>
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
  boxTitleContainer: {
    borderTopLeftRadius: 10, 
    borderTopRightRadius: 10, 
    backgroundColor: colors.point, 
    paddingVertical: 5, 
    paddingHorizontal: 10, 
    marginLeft: 20, 
    alignSelf: 'flex-start'
  },
  boxContainer: {
    padding: 20, 
    borderRadius: 20, 
    backgroundColor: '#FFF1F1'
  },
  titleText: {
    fontFamily: "Pretendard-Bold", 
    fontSize: 14, 
    color: colors.white,
  },
  smallText: {
    fontFamily: "Pretendard-Regular", 
    fontSize: 14, 
  }
});

export default Banner2;