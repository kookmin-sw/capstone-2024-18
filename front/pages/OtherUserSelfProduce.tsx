import { View, Text, ScrollView, StyleSheet, Dimensions, StyleProp, ViewStyle } from 'react-native';
import { colors } from '../assets/colors.tsx'
import CustomButton from '../components/CustomButton';
import React, { useContext, useEffect, useState } from 'react';
import CustomTextInput from '../components/CustomTextInput.tsx';
import ImageWithIconOverlay from '../components/ImageWithIconOverlay.tsx';
import CarouselSlider from '../components/CarouselSlider.tsx';
import SelectableTag from '../components/SelectableTag.tsx';

import { getOtherResume, isErrorResponse, isResumeResponse } from '../util/auth.tsx';
import { AuthContext } from "../store/auth-context";

import { AgeDegree, AgeGroup, Gender, HeightGroup, Region, ageDegree, ageGroup, gender, heightGroup, region } from '../util/basicInfoFormat.tsx';
import { Category, category } from '../util/categoryFormat.tsx';
import { useRoute } from '@react-navigation/native';
import CustomBackHandler from '../components/CustomBackHandler.tsx';
import HeaderBar from '../components/HeaderBar.tsx';


const OtherUserSelfProduce = ({navigation}: any) => {
  // auth를 위한 method
  const authCtx = useContext(AuthContext);

  const route = useRoute();
  const resumeId = (route.params as { resumeId: number })?.resumeId;

  // CarouselSlider의 필수 파라미터, pageWidth, offset, gap 설정
  const width = Dimensions.get('window').width;
  const pageWidth = width;
  const offset = 0;
  const [ gap, setGap ] = useState({leftGap: 0, rightGap: 0, topGap: 0, bottomGap: 0});

  // 현재 이미지 슬라이더의 페이지를 알기 위한 페이지 설정
  const [ page, setPage ] = useState(0);

  // (임시) 이미지 슬라이더의 내부 contents 설정 (api 연동하면, 그냥 빈 array 설정)
  interface ImageFormat {
    id: number;
    source: (NodeRequire | {uri: string})
  }
  const [ images, setImages ] = useState<ImageFormat[]>([]);

  // 기본 정보
  const defaultSamples = ["DEFAULT", "DEFAULT", "DEFAULT", "DEFAULT"]
  const [ basic, setBasic ] = useState(defaultSamples.map((_basic, index) => {
    return {id: index, text: _basic}
  }))
  const [nickname, setNickname] = useState('DEFAULT');

  // 관상 분석
  const [ analysis, setAnalysis ] = useState(defaultSamples.map((_a, index)=> {
    return {id: index, text: _a};
  }))

  const [ categories, setCategories ] = useState(Object.keys(category).map((key, index) => {
    return {id: index, text: key as keyof Category, selected: false}
  }))
  const [ essay, setEssay ] = useState('DEFAULT');

  /**
   * 이미지 슬라이더에 들어갈 컨텐츠 내용물 데이터를 React.ReactNode로 바꿔주는 함수
   * @param param0 :any
   * @param containerStyle :이미지 슬라이더가 gap, offset 등을 설정할 수 있게, style을 파라미터로 받아서, 알맞은 ReactNode에 적용
   * @returns React.ReactNode
   */
  function renderItem({id, source}: any, 
    containerStyle: StyleProp<ViewStyle>) {
    return (
      <ImageWithIconOverlay
        source={source} borderRadius={0} key={id}
        containerStyle={containerStyle}/>
    );
  }

  const handleHeart = async () => {
    navigation.goBack();
  }

  const tryGetResume = async () => {
    if (authCtx.accessToken) {
      console.log(resumeId);
      const response = await getOtherResume(
        authCtx.accessToken, resumeId
      );
      if (isResumeResponse(response)) {
        // 기본 정보 설정
        const newBasic = [ 
          gender[response.basicInfo.gender as keyof Gender], 
          ageGroup[response.basicInfo.ageGroup as keyof AgeGroup] + ageDegree[response.basicInfo.ageDegree as keyof AgeDegree], 
          heightGroup[response.basicInfo.heightGroup as keyof HeightGroup], 
          '서울 ' + region['SEOUL'][response.basicInfo.region as keyof Region['SEOUL']]];
        setBasic(newBasic.map((_basic, index) => {
          return {id: index, text: _basic}
        }));
        setNickname(response.basicInfo.nickname);

        // 이미지 설정
        const imageTexts = [response.faceInfo.generatedS3url, ...response.resumeImageS3urls];
        setImages(imageTexts.map((imageText, index) => {
          return {id: index, source: {uri: imageText}}
        }));

        // 카테고리 설정
        const newCategories = categories.map(_category => {
          // response로 받은 선택된 카테고리면 selected true 설정
          for (const selectedCategory of response.categories) {
            if (_category.text === selectedCategory as keyof Category) {
              return { ..._category, selected: true };
            }
          }
          // selected false 설정
          return { ..._category, selected: false };
        });
        setCategories(newCategories);

        // 소개 설정
        setEssay(response.content);

        // face analysis 설정
        // 왜인지 몰라도 코드를 카테고리 설정 위에 놓으면, 중간에 return 됨. 아니..기본 정보는 되면서...
        setAnalysis(response.analysisInfo.analysisShort.map((_analysis, index) => {
          return {id: index, text: _analysis}
        }))
      } 
      if (isErrorResponse(response)) {
        navigation.goBack();
      } 
    }
    else {
      console.log("로그인 정보가 없습니다.");
    }
  }

  useEffect(() => {
    tryGetResume();
  }, [])

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* 이미지 슬라이더 */}
      <CustomBackHandler onBack={() => navigation.goBack()}/>
      <HeaderBar onPress={navigation.goBack}>자기소개서</HeaderBar>
      <CarouselSlider
        pageWidth={pageWidth}
        pageHeight={pageWidth}
        offset={offset}
        gap={gap}
        data={images}
        onPageChange={setPage}
        initialScrollIndex={0}
        renderItem={renderItem}/>

      <View style={{flexDirection: 'row', alignSelf: 'center'}}>
      {
        images.map((item, idx) => {
          return (
            <View 
              key={idx}
              style={{marginHorizontal: 4, width: 8, height: 8, borderRadius: 50,
              backgroundColor: (idx == page) ? colors.pastel_point : colors.gray2}}/>
          );
        })
      }
      </View>

      <View style={styles.container} >
        {/* 프로필 사진, 이름 섹션 */}
        {/* 아직 정확한 디자인 안나와서 일단 보류 */}
        <View style={styles.sectionTop}>
          <Text style={styles.profileName}>{nickname}</Text>
        </View>

        {/* 기본 정보 섹션 */}
        <View style={styles.section}>
          <View style={styles.sectionTop}>
            <Text style={styles.sectionText}>기본 정보</Text>
          </View>
          <View style={styles.tagContainer}>
          {
            basic.map((item) => {
              return (
                <SelectableTag 
                  key={item.id}
                  touchAreaStyle={{marginRight: 6, marginBottom: 6}}
                  containerStyle={styles.uneditableTag} 
                  textStyle={styles.uneditableText} children={item.text}/>
              );
            })
          }
          </View>
        </View>

        {/* 관상 정보 섹션 */}
        <View style={styles.section}>
          <View style={styles.sectionTop}>
            <Text style={styles.sectionText}>관상 정보</Text>
          </View>
          <View style={styles.tagContainer}>
          {
            analysis.map((item) => {
              return (
                <SelectableTag 
                  key={item.id}
                  touchAreaStyle={{marginRight: 6, marginBottom: 6}}
                  height={25}
                  containerStyle={styles.uneditableTag} 
                  textStyle={styles.uneditableText} children={item.text}/>
              );
            })
          }
          </View>
        </View>

        {/* 카테고리 섹션 */}
        <View style={{paddingTop: 20}}>
          <View style={styles.sectionTop}>
            <Text style={styles.sectionText}>카테고리</Text>
          </View>
          <View style={styles.tagContainer}>
          {
            categories.map((item) => {
              return (
                <SelectableTag 
                  key={item.id}
                  touchAreaStyle={{marginRight: 6, marginBottom: 6}}
                  height={25}
                  selectable={{
                    select: item.selected, showSelectedOnly: true,
                    selectedStyle: {backgroundColor: colors.point, borderColor: colors.point},
                    unselectedStyle: {backgroundColor: colors.gray5, borderColor: colors.gray5},
                    selectedTextStyle: {color: colors.white},
                    unselectedTextStyle: {color: colors.white}
                  }}
                  containerStyle={styles.uneditableTag} 
                  textStyle={styles.uneditableText} children={category[item.text]}/>
              );
            })
          }
          </View>
        </View>

        {/* 자기소개서 내용 섹션 */}
        <View style={styles.section}>
          <View style={styles.sectionTop}>
            <Text style={styles.sectionText}>소개</Text>
          </View>
          <CustomTextInput 
            containerStyle={styles.inputContainer} 
            style={{flex: 1, color: colors.gray9}} multiline={true}
            editable={false}
            onChangeText={(text) => {setEssay(text)}}
            children={essay}/>
        </View>

        <View style={[styles.section, styles.bottomContainer]}>
          <CustomButton 
            containerStyle={{backgroundColor: colors.point, marginHorizontal: 5}}
            textStyle={{color: colors.white}} onPress={handleHeart}>
            {"하트 보내기"}
          </CustomButton>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 32,
    flex: 1,
    backgroundColor: colors.white
  },
  profileName: {
    fontSize: 20, 
    color: '#000000', 
    alignSelf: 'center'
  },

  // tag 관련
  tagContainer: {
    flexDirection: "row", 
    flexWrap: "wrap"
  }, 
  uneditableTag: {
    borderWidth: 1, 
    borderColor: colors.point,
    backgroundColor: colors.white,
    alignItems: 'center',
    borderRadius: 20
  },
  uneditableText: {
    color: colors.gray7, 
    fontSize: 14,
    marginLeft: 9,
    marginRight: 9
  },

  // 각 섹션
  section: {
    paddingTop: 20
  },
  sectionTop: {
    flexDirection: "row", 
    flexWrap: "wrap",
    margin: 5
  }, 
  sectionText: {
    fontSize: 14,
    color: colors.gray9,
    paddingRight: 7
  }, 
  sectionHintText: {
    fontSize: 14,
    color: colors.gray6,
    paddingLeft: 5
  },

  // 자기소개 input
  inputContainer: {
    backgroundColor: colors.gray2, 
    marginVertical: 7, 
    marginHorizontal: 0, 
    padding: 15, 
    borderRadius: 15,
    height: undefined
  },

  bottomContainer: {
    alignItems: "center",
    marginBottom: 23,
    paddingHorizontal: 8,
  },
});

export default OtherUserSelfProduce;