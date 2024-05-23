import { View, Text, ScrollView, StyleSheet, Dimensions, StyleProp, ViewStyle, Image, useWindowDimensions } from 'react-native';
import { colors } from '../../assets/colors.tsx'
import React from 'react';
import RenderHtml from 'react-native-render-html';
import AutoHeightImage from 'react-native-auto-height-image';
import HeaderBar from '../../components/HeaderBar.tsx';
import CustomBackHandler from '../../components/CustomBackHandler.tsx';


const Banner3 = ({ navigation }: any) => {
  const {width, height} = useWindowDimensions();
  const bannerContent = `<span style='color: ${colors.gray7};'><span style='color: ${colors.point};'>FACE FRIEND</span> 는 관상 관련 서적 및 논문에 근거해 <span style='color: ${colors.point};'>관상 규칙</span>을 만들었고, 이를 학습시킨 <span style='color: ${colors.point};'>AI</span>를 통해 관상을 도출할 수 있게 만들었어요. <br><br> <span style='color: ${colors.point};'>FACE FRIEND</span> 를 이용해주시는 여러분들을 위해 재미를 더해드리고자 <span style='color: ${colors.point};'>관상별 궁합</span>을 정리해봤어요! <br><br> 친구와 나, 연인과 나, 상대와 나의 <span style='color: ${colors.point};'>관상 궁합</span>이 어떤지 궁금하지 않나요?! <br><br><span style='color: ${colors.point};'>FACE FRIEND</span> 에서 여러분의 관상을 확인해보세요!</span>`;
  const bannerContents = [
    {title: '목형 + 수형', html: `<span style='color: ${colors.gray7};'>목형의 예민하고 낯을 가리는 성격을 수형이 부드럽고 유머러스하게 받아줘요. 또 감정 기복이 많은 수형을 목형이 헌신적으로 맞춰주기 때문에 서로 잘 맞아요. 둘 다 감수성이 풍부하고 감성적이어서 통하는 부분이 많아요. 단, 둘 다 현실감이 부족할 수 있다는 게 단점이에요. 서로 감정적으로 흐르다 보면 작은 일에도 크게 서운해하며 감정의 골이 깊게 패일 수 있어요. 이 점만 보완한다면 최상의 궁합이에요!</span>`},
    {title: '화형 + 목형', html: `<span style='color: ${colors.gray7};'>성격이 활발하고 적극적인 화형과 내성적이고 정적인 목형이 만나서 즐겁고 유쾌한 궁합을 이뤄요. 서로 갈등이 생겨도 길게 끌지 않고 바로 화해하는 궁합이어서 큰 마찰이 없어요. 단, 외적으로 화려함을 좋아하는 화형과 수수함을 좋아하는 목형의 취향이 다르다보니 인테리어나 패션에서 작은 의견충돌이 있을 수 있어요.</span>`},
    {title: '토형 + 화형', html: `<span style='color: ${colors.gray7};'>다소 산만하고 급할 수 있는 화형의 성격을 차분하고 현실적인 토형이 균형을 잡아주는 궁합이에요. 또 한번 틀어지면 끝장을 보는 토형의 외골수적인 부분을 눈치 빠른 화형이 순발력있게 대처하는 편이에요. 단, 토형도 평소에는 온화하고 부드럽지만 가끔 한번씩 욱할 대가 있어서 다혈질적인 화형과 강하게 부딫힐 수 있어요. 하지만 평소에 토형이 받아주는 평이고, 잦은 갈등은 있어도 큰 갈등은 없어요.</span>`},
    {title: '금형 + 토형', html: `<span style='color: ${colors.gray7};'>실리적이고 현실적인 토형과 논리정연하고 객관적인 판단력을 갖춘 금형은 궁합이 잘 맞아요. 둘 다 사물을 바라보는 시선이나 생각이 객관적이다 보니 살면서 잘못된 판단을 하거나 실패하는 확률이 적기 때문에 가장 안정적으로 살 수 있어요. 하지만 둘 다 감정적으로 표현하는 부분이 적고 너무 비판적으로만 흐를 수 있어서 건조한 궁합이 될 수 있어요.</span>`},
    {title: '수형 + 금형', html: `<span style='color: ${colors.gray7};'>원리원칙적이고 자기 주관이 분명해 딱딱할 수 있는 금형과 감성적이면서도 상대방의 생각과 분위기를 잘 받아주는 유머러스한 수형이 잘 맞아요. 생각이 많아서 결론을 잘 내리지 못하는 수형에게 생각을 깔끔히 정리해줄 수 있는 금형이 잘 맞아요. 단, 너무 지나치면 금형은 감정 기복이 강한 수형을 이해하지 못하고, 수형은 너무 자기 주관대로 끌고가는 금형에게 불만을 가질 수 있어요. </span>`},
  ];
  
  return(
    <ScrollView contentContainerStyle={{backgroundColor: colors.white}}>
      <CustomBackHandler onBack={navigation.goBack}/>
      <HeaderBar onPress={navigation.goBack}>상세보기</HeaderBar>
      <AutoHeightImage width={width} source={require(`../../assets/images/banner3.png`)}/>
      <View style={styles.container}>
        <View style={{flexDirection: 'row', paddingTop: 20}}>
          <AutoHeightImage
            width={width/4}
            source={require('../../assets/images/logo.png')}/>
          <Text style={styles.bigText}>의</Text>
        </View>
        <Text style={[styles.bigText, {paddingBottom: 20}]}>관상 궁합을 소개합니다!</Text>

        <RenderHtml defaultTextProps={{style: styles.smallText}} source={{html: bannerContent}}/>
        <View style={{marginVertical: 20}}>
          <View style={styles.boxTitleContainer}>
            <Text style={styles.titleText}>오행별 궁합</Text>
          </View>
          <View style={styles.boxContainer}>
            <AutoHeightImage
              width={width/2} style={{alignSelf: 'center'}}
              source={require('../../assets/images/five_faces.png')}/>
          </View>
        </View>
        {bannerContents.map(({title, html}, index) => {
          return (
            <View style={{marginVertical: 10}}>
              <Text style={styles.sectionText}>{title}</Text>
              <RenderHtml defaultTextProps={{style: styles.smallText}} source={{html: html}}/>
            </View>);
        })}
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
  sectionText: {
    fontFamily: "Pretendard-Bold", 
    color: colors.point,
    fontSize: 20, 
    paddingVertical: 5
  },
  smallText: {
    fontFamily: "Pretendard-Regular", 
    fontSize: 14, 
  }
});

export default Banner3;