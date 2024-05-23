import { View, Text, ScrollView, StyleSheet, Dimensions, Alert, StyleProp, ViewStyle, ImageURISource, Pressable, AppState } from 'react-native';
import { Icon } from 'react-native-paper';
import { colors } from '../assets/colors.tsx'
import CustomButton from '../components/CustomButton';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import CustomTextInput from '../components/CustomTextInput.tsx';
import ImageWithIconOverlay from '../components/ImageWithIconOverlay.tsx';
import CarouselSlider from '../components/CarouselSlider.tsx';
import SelectableTag from '../components/SelectableTag.tsx';
import { showModal } from '../components/CameraComponent.tsx';

import { deleteMyResume, getMyResume, isErrorResponse, isResumeResponse, isValidResponse, postMyResume, putResume, resumeResponse } from '../util/auth.tsx';
import { AuthContext } from "../store/auth-context";

// 이미지들의 고유 key를 임시로 주기 위한 라이브러리
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { AgeDegree, AgeGroup, Gender, HeightGroup, Region, ageDegree, ageGroup, gender, heightGroup, region } from '../util/basicInfoFormat.tsx';
import { Category, category } from '../util/categoryFormat.tsx';
import { UserContext } from '../store/user-context.tsx';
import { useFocusEffect } from '@react-navigation/native';
import { AlertContext } from '../store/alert-context.tsx';


const SelfProduce = ({navigation, route}: any) => {
  interface imageType {
    id: string,
    type: 'basic' | 'image' | 'add',
    source: ImageURISource
  }

  // auth를 위한 method
  const authCtx = useContext(AuthContext);
  const userCtx = useContext(UserContext);
  const { createAlertMessage } = useContext(AlertContext);

  // 자기소개서가 있는지 확인 (현재는 auth 연결 아직 안함)
  const [ haveSelfProduce, setHaveSelfProduce ] = useState(userCtx.resumeinfo ? true : false);

  // 기본 정보
  const defaultSample = "DEFAULT";
  const defaultSamples = ["DEFAULT", "DEFAULT", "DEFAULT", "DEFAULT"]
  const [ basic, setBasic ] = useState(defaultSamples.map((_basic, index) => {
    return {id: index, text: _basic}
  }))
  const [nickname, setNickname] = useState(defaultSample);

  // 관상 분석
  const [ analysis, setAnalysis ] = useState(defaultSamples.map((_a, index)=> {
    return {id: index, text: _a};
  }))

  const [ categories, setCategories ] = useState(Object.keys(category).map((key, index) => {
    return {id: index, text: key as keyof Category, selected: false}
  }))
  const [ essay, setEssay ] = useState(defaultSample);

  // 자기소개서 edit 기능 조절 변수
  const [ edit, setEdit ] = useState(false);

  // (임시) 이미지 슬라이더의 내부 contents 설정 (api 연동하면, 그냥 빈 array 설정)
  const [ images, setImages ] = useState<imageType[]>([]);

  // CarouselSlider의 필수 파라미터, pageWidth, offset, gap 설정
  const width = Dimensions.get('window').width;
  const [ pageWidth, setPageWidth ] = useState(width);
  const [ offset, setOffset ] = useState(0);
  const [ gap, setGap ] = useState({leftGap: 0, rightGap: 0, topGap: 0, bottomGap: 0});

  // 현재 이미지 슬라이더의 페이지를 알기 위한 페이지 설정
  const [ page, setPage ] = useState(0);

  // 이미지 추가 설정 (카메라 or 사진첩)
  const [ modalVisible, setModalVisible ] = useState(false);

  // 자기소개서 삭제 관련 기능
  function deleteAlert() {
    Alert.alert(
      "정말 삭제하시겠습니까?", 
      "삭제하면, 해당 자기소개서를 복구할 수 없습니다",
      [
        {
          text: "확인",
          onPress: deleteSelfProduce
        },
        {
          text: "취소",
          style: 'cancel'
        }
      ]
    )
  }

  const deleteSelfProduce = async () => {
    // 자기소개서 삭제하는 요청 전송
    if (authCtx.accessToken) {
      const response = await deleteMyResume(authCtx.accessToken);
      if (isValidResponse(response)) {
        setImages([]);
        userCtx.setResumeinfo(undefined);
        userCtx.setStatus('RESUME_DELETE');
      }
      if (isErrorResponse(response)) {
        createAlertMessage(response.message);
      }
    } 
    else {
      console.log("로그인 정보가 없습니다.");
    }
  }

  const createMyResume = async () => {
    if (authCtx.accessToken) {
      const response = await postMyResume(
        authCtx.accessToken,
      );
      if (isResumeResponse(response)) {
        userCtx.setResumeinfo(response);
        setEdit(false);setEdit(true);
        userCtx.setStatus('RESUME_CREATE');
      } 
      if (isErrorResponse(response)) {
        createAlertMessage(response.message);
      }
    }
    else {
      console.log("로그인 정보가 없습니다.");
    }
  }

  const resetMyResume = async (response: resumeResponse) => {
    // 기본 정보 설정
    const newBasic = [ 
      gender[response.basicInfo.gender as keyof Gender], 
      ageGroup[response.basicInfo.ageGroup as keyof AgeGroup] + ageDegree[response.basicInfo.ageDegree as keyof AgeDegree], 
      heightGroup[response.basicInfo.heightGroup as keyof HeightGroup], 
      '서울 ' + region['SEOUL'][response.basicInfo.region as keyof Region['SEOUL']]];
    setBasic(newBasic.map((_basic, index) => {
      return {id: index, text: _basic}
    }))
    setNickname(response.basicInfo.nickname);

    // faceInfo 설정
    setImages([]);
    await handleAddImageAtIndex(0, {id: uuidv4(), type: 'basic', source: {uri: response.faceInfo.generatedS3url}});

    for (var index = 0; index < response.resumeImageS3urls.length; index++) {
      await handleAddImageAtIndex(index+1, {id: uuidv4(), type: 'image', source: {uri: response.resumeImageS3urls[index]}});
    }
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

  const handleEditButton = async () => {
    if (edit) {
      if (authCtx.accessToken) {
        const imageText = [];
        const categorieText = [];

        for (var index=1; index<images.length-1; index++) {
          if (images[index].source.uri !== undefined) {
            imageText.push(images[index].source.uri ?? '');
          }
        };
        for (const _category of categories) {
          if (_category.selected) {
            categorieText.push(_category.text);
          }
        };
        const response = await putResume(
          authCtx.accessToken, 
          imageText,
          categorieText,
          essay
        )
        if (isResumeResponse(response)) {
          console.log("완료", response);
          userCtx.setStatus('RESUME_COMPLETE');
          setEdit(false);
          userCtx.setResumeinfo(response);
        }
        if (isErrorResponse(response)) { // 흙흙 
          if (response.exceptionCode === 0) {
            createAlertMessage("최소한 1개 이상의 이미지를 추가해야 합니다!");
          } else {
            createAlertMessage(response.message);
          }
        }
      }
    }
    else {
      userCtx.setStatus('RESUME_EDIT');
      setEdit(true);
    }
  }

  function takePhoto() {
    setModalVisible(true);
  }
  function setPhoto(uri: string) {
    handleAddImageAtIndex(images.length-1, {id: uuidv4(), type: 'image', source: {uri: uri}})
  }

  // 이미지 슬라이더의 content handler
  const handleAddImageAtIndex = async (index: number, newImage: any) => {
    setImages(prevImages => {
      const newImages = [...prevImages];
      newImages.splice(index, 0, newImage);
      return newImages
    })
  };
  const handleDeleteImageWidthId = (id: string) => {
    const newData = images.filter(image=> image.id !== id);
    setImages(newData);
  };

  // 특정 인덱스의 카테고리를 선택, 선택 취소
  function handleCategorySelect(changeIdx: number) {
    const nextCategory = categories.map((category) => {
      if (category.id === changeIdx) {
        return {
          ...category,
          selected: !category.selected,
        };
      } else {
        return category;
      }
    });
    // Re-render with the new array
    setCategories(nextCategory);
  }

  /**
   * 이미지 슬라이더에 들어갈 컨텐츠 내용물 데이터를 React.ReactNode로 바꿔주는 함수
   * @param param0 :any
   * @param containerStyle :이미지 슬라이더가 gap, offset 등을 설정할 수 있게, style을 파라미터로 받아서, 알맞은 ReactNode에 적용
   * @returns React.ReactNode
   */
  function renderItem({id, type, source}: any,
    containerStyle: StyleProp<ViewStyle>) {
    if (type === 'basic') {
      return (
        <ImageWithIconOverlay
          source={source} borderRadius={edit?15:0} key={id}
          containerStyle={containerStyle}/>
      );
    }
    else if (type === 'image') {
      return (
        <ImageWithIconOverlay
          source={source} borderRadius={edit?15:0} key={id}
          containerStyle={containerStyle}
          rightIcon={edit?{source: require('../assets/images/close.png')}:undefined} 
          rightPressable={{onPress: () => {handleDeleteImageWidthId(id)}}}/>
      );
    } else{
      return (
        <View style={[containerStyle, {backgroundColor: colors.gray2, borderRadius: 15}]}>
          <Pressable style={{flex: 1, justifyContent: 'center', alignItems: 'center'}} onPress={takePhoto}>
            <Icon size={80} source={'plus'}/>
          </Pressable>
        </View>
      );
    } 
  }

  // useEffect들
  // edit 기능 설정하고 저장할 때, 이미지 추가 버튼 생성, 삭제, 이미지 슬라이더의 gap, offset, page width 재설정
  useEffect(() => {
    if (!edit) {
      // 이미지 추가 페이지 삭제
      if (images.length === 0) return

      if (images[images.length-1].type == 'add') {
        images.pop()
      }

      // page width, offset, gap 재설정
      setPageWidth(width);
      setOffset(0);
      setGap({leftGap: 0, rightGap: 0, topGap: 0, bottomGap: 0});
    } else {
      // 이미지 추가 페이지 생성
      if (images[images.length-1].type != 'add') {
        handleAddImageAtIndex(images.length, {id: uuidv4(), type: 'add', source: null});
      }

      // page width, offset, gap 재설정
      const _offset = 37;
      const _gap = 20;
      setPageWidth(width - _offset * 2 - _gap * 2);
      setOffset(_offset);
      setGap({leftGap: _gap, rightGap: _gap, topGap: 46, bottomGap: 20});
    }
  }, [edit])

  useEffect(() => {
    if (userCtx.resumeinfo) {
      setHaveSelfProduce(true);
      resetMyResume(userCtx.resumeinfo);
    } else {
      setHaveSelfProduce(false);
    }
  }, [userCtx.resumeinfo])

  useFocusEffect(
    useCallback(() => {
      setEdit(false);
    }, [])
  )

  return (
    <>
      {showModal(modalVisible, () => {setModalVisible(false)}, setPhoto )}
      {(haveSelfProduce == false) 
      ? 
      <View style={styles.container}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Icon size={150} source={require('../assets/images/surprise.png')}/>
          <View style={{marginTop: 20, alignItems: 'center'}}>
            <Text style={styles.hintText}>자기소개서가 존재하지 않습니다. {'\n'}나를 소개해보세요</Text>
          </View>
        </View>
        <View style={styles.bottomContainer}>
          <CustomButton 
            containerStyle={{backgroundColor: colors.point, elevation: 4}}
            onPress={createMyResume}
            textStyle={{color: colors.white, fontSize: 18, fontFamily: 'Pretendard-SemiBold', letterSpacing: -18* 0.02}}>자기소개서 작성하기
          </CustomButton>
        </View>
      </View>
      : 
      <ScrollView showsVerticalScrollIndicator={false} style={{backgroundColor: colors.white}}>
        {/* 이미지 슬라이더 */}
        <CarouselSlider
          pageWidth={pageWidth}
          pageHeight={pageWidth}
          offset={offset}
          gap={gap}
          data={images}
          onPageChange={setPage}
          initialScrollIndex={0}
          renderItem={renderItem}/>

        <View style={{flexDirection: 'row', alignSelf: 'center', paddingTop: 10}}>
        {
          images.map((item, idx) => {
            return (
              (item.type == 'add' && !edit) ? null : 
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
          <View style={styles.sectionTop}>
            <Text style={styles.profileName}>{nickname}</Text>
          </View>

          {/* 기본 정보 섹션 */}
          <View style={styles.section}>
            <View style={styles.sectionTop}>
              <Text style={styles.sectionText}>기본 정보</Text>
              <Icon source={'progress-question'} size={20} color={colors.pastel_point}/>
              <Text style={[styles.sectionHintText, {display: edit ? 'flex' : 'none'}]}>프로필에서 수정 가능해요</Text>
            </View>
            <View style={styles.tagContainer}>
            {
              basic.map((item) => {
                return (
                  <SelectableTag 
                    key={item.id}
                    touchAreaStyle={{marginRight: 4, marginBottom: 4}}
                    containerStyle={styles.uneditableTag} 
                    textStyle={styles.uneditableText} 
                    children={item.text}/>
                );
              })
            }
            </View>
          </View>

          {/* 관상 정보 섹션 */}
          <View style={styles.section}>
            <View style={styles.sectionTop}>
              <Text style={styles.sectionText}>관상 정보</Text>
              <Icon source={'progress-question'} size={20} color={colors.pastel_point}/>
              <Text style={{...styles.sectionHintText, display: edit ? 'flex' : 'none'}}>프로필에서 수정 가능해요</Text>
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
                      select: item.selected, showSelectedOnly: !edit,
                      selectedStyle: {backgroundColor: colors.point, borderColor: colors.point},
                      unselectedStyle: {backgroundColor: colors.gray5, borderColor: colors.gray5},
                      selectedTextStyle: [styles.uneditableText, {color: colors.white}],
                      unselectedTextStyle: [styles.uneditableText, {color: colors.white}]
                    }}
                    containerStyle={styles.uneditableTag} 
                    onPress={() => {handleCategorySelect(item.id)}}
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
              editable={edit ? true : false}
              onChangeText={(text) => {setEssay(text)}}
              children={essay}/>
          </View>

          <View style={[styles.section, {flexDirection: 'row'}, styles.bottomContainer]}>
            <View style={{width: "50%", display: edit ? 'none' : 'flex'}}>
              <CustomButton 
                containerStyle={{backgroundColor: colors.gray4, marginHorizontal: 5, elevation: 4}} onPress={deleteAlert}
                textStyle={{color: colors.white, fontSize:18, letterSpacing: -18* 0.02, fontFamily: "Pretendard-SemiBold"}}>삭제하기
              </CustomButton>
            </View>
            <View style={{width: edit ? "100%" : "50%"}}>
              <CustomButton 
                containerStyle={{backgroundColor: colors.point, marginHorizontal: 5, elevation: 4}} onPress={handleEditButton}
                textStyle={{color: colors.white, fontSize:18, letterSpacing: -18* 0.02, fontFamily: "Pretendard-SemiBold"}}>
                {edit ? "완료" : "수정하기"}
              </CustomButton>
            </View>
          </View>
        </View>
      </ScrollView>
    }</>
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
    fontFamily: 'Pretendard-SemiBold',
    color: colors.gray7, 
    alignSelf: 'center'
  },

  hintText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 16,
    letterSpacing: -16* 0.02,
    textAlign: 'center',
    color: colors.gray7
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
    fontFamily: 'Pretendard-Medium',
    letterSpacing: -14* 0.02,
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
    fontFamily: 'Pretendard-SemiBold',
    color: colors.gray9,
    paddingRight: 7
  }, 
  sectionHintText: {
    fontSize: 12,
    fontFamily: "Pretendard-Regular",
    letterSpacing: -12* 0.02,
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

export default SelfProduce;