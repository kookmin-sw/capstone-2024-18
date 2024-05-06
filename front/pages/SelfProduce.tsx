import { View, Text, ScrollView, StyleSheet, Dimensions, Alert, StyleProp, ViewStyle } from 'react-native';
import { Icon } from 'react-native-paper';
import { colors } from '../assets/colors.tsx'
import CustomButton from '../components/CustomButton';
import React, { useContext, useEffect, useState } from 'react';
import CustomTextInput from '../components/CustomTextInput.tsx';
import ImageWithIconOverlay from '../components/ImageWithIconOverlay.tsx';
import CarouselSlider from '../components/CarouselSlider.tsx';
import SelectableTag from '../components/SelectableTag.tsx';
import { showModal } from '../components/CameraComponent.tsx';

import { deleteMyResume, getMyResume, isErrorResponse, isResumeResponse, isValidResponse, postMyResume } from '../util/auth.tsx';
import { AuthContext } from "../store/auth-context";

// 이미지들의 고유 key를 임시로 주기 위한 라이브러리
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { createAlertMessage } from '../util/alert.tsx';
import { AgeDegree, AgeGroup, Gender, HeightGroup, Region, ageDegree, ageGroup, gender, heightGroup, region } from '../util/basicInfoFormat.tsx';
import { Category, category } from '../util/categoryFormat.tsx';


const SelfProduce = () => {
  // auth를 위한 method
  const authCtx = useContext(AuthContext);

  // 자기소개서가 있는지 확인 (현재는 auth 연결 아직 안함)
  const [ haveSelfProduce, setHaveSelfProduce ] = useState(false);

  // 자기소개서 삭제 관련 기능
  function deleteAlert() {
    Alert.alert(
      "정말 삭제하시겠습니까?", 
      "삭제하면, 해당 자기소개서를 복구할 수 없습니다",
      [
        {
          text: "아니요",
          style: 'cancel'
        },
        {
          text: "네",
          onPress: deleteSelfProduce
        }
      ])
  }

  const deleteSelfProduce = async () => {
    // UI 상에서 자기소개 만들기
    setHaveSelfProduce(false);

    // 자기소개서 삭제하는 요청 전송
    if (authCtx.accessToken) {
      deleteMyResume(authCtx.accessToken)
    } 
    else {
      console.log("로그인 정보가 없습니다.");
    }
  }

  // 자기소개서 edit 기능 조절 변수
  const [ edit, setEdit ] = useState(false);

  // CarouselSlider의 필수 파라미터, pageWidth, offset, gap 설정
  const width = Dimensions.get('window').width;
  const [ pageWidth, setPageWidth ] = useState(width);
  const [ offset, setOffset ] = useState(0);
  const [ gap, setGap ] = useState({leftGap: 0, rightGap: 0, topGap: 0, bottomGap: 0});

  // 현재 이미지 슬라이더의 페이지를 알기 위한 페이지 설정
  const [ page, setPage ] = useState(0);

  // 이미지 추가 설정 (카메라 or 사진첩)
  const [ modalVisible, setModalVisible ] = useState(false);
  function takePhoto() {
    setModalVisible(true);
  }
  function setPhoto(uri: string) {
    handleAddImageAtIndex(images.length-1, {id: uuidv4(), type: 'image', source: {uri: uri}})
  }

  // (임시) 이미지 슬라이더의 내부 contents 설정 (api 연동하면, 그냥 빈 array 설정)
  const [ images, setImages ] = useState([
    {
      id: uuidv4(),
      type: 'image',
      source: require('../assets/images/imageTest1.png')
    },
  ]);

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
          rightIcon={edit?{source: require('../assets/images/Icon.png')}:undefined} 
          rightPressable={{onPress: () => {handleDeleteImageWidthId(id)}}}/>
      );
    } else{
      return (
        <ImageWithIconOverlay
          borderRadius={15} key={id}
          containerStyle={[containerStyle, {backgroundColor: colors.gray2}]}
          centerIcon={{size: 80, source: 'plus'}} centerPressable={{onPress: () => takePhoto(), style:{alignSelf: 'center'}}}/>
      );
    } 
  }

  // 기본 정보
  const _basics = ["DEFAULT", "DEFAULT", "DEFAULT", "DEFAULT"]
  const [ basic, setBasic ] = useState(_basics.map((_basic, index) => {
    return {id: index, text: _basic}
  }))
  const [nickname, setNickname] = useState('DEFAULT');

  // 관상 분석
  const _analysis = ["DEFAULT", "DEFAULT", "DEFAULT", "DEFAULT"]
  const [ analysis, setAnalysis ] = useState(_analysis.map((_a, index)=> {
    return {id: index, text: _a};
  }))

  const [ categories, setCategories ] = useState(Object.keys(category).map((key, index) => {
    return {id: index, text: category[key as keyof Category], selected: false}
  }))
  const [ essay, setEssay ] = useState('DEFAULT');

  const tryGetMyResume = async () => {
    if (authCtx.accessToken) {
      const response = await getMyResume(
        authCtx.accessToken
      );
      if (isResumeResponse(response)) {
        console.log("??", response);
        setHaveSelfProduce(true);

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
        console.log(response.faceInfo);
        await handleAddImageAtIndex(0, {id: uuidv4(), type: 'basic', source: {uri: response.faceInfo.generatedS3url}});
        await handleAddImageAtIndex(1, {id: uuidv4(), type: 'basic', source: {uri: response.faceInfo.originS3url}});

        // 카테고리 설정
        const newCategories = categories.map(_category => {
          // response로 받은 선택된 카테고리면 selected true 설정
          for (const selectedCategory of response.category) {
            if (_category.text === category[selectedCategory as keyof Category]) {
              return { ..._category, selected: true };
            }
          }
          // selected false 설정
          return { ..._category, selected: false };
        });
        console.log(newCategories);
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
        setHaveSelfProduce(false);
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
        console.log("?", response);
      } 
      if (isErrorResponse(response)) {
        createAlertMessage(response.message);
      }
    }
    else {
      console.log("로그인 정보가 없습니다.");
    }
  }

  const writeResume = () => {
    setHaveSelfProduce(true);
  };

  const deleteResume = async () => {
    if (authCtx.accessToken) {
      const response = await deleteMyResume(
        authCtx.accessToken
      );
      if (isValidResponse(response)) {
        createAlertMessage(response.message, () => setHaveSelfProduce(false))
      }
      if (isErrorResponse(response)) {
        console.log(response);
      }
    }
    else {
      console.log("로그인 정보가 없습니다.");
    }
  }

  // useEffect들
  // edit 기능 설정하고 저장할 때, 이미지 추가 버튼 생성, 삭제, 이미지 슬라이더의 gap, offset, page width 재설정
  useEffect(() => {
    if (!edit) {
      // 이미지 추가 페이지 삭제
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
        console.log('test')
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
    tryGetMyResume();
  }, [])

  // 아직 api 연동 못한 것 -> 나중에 default 등 처리 예정
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

  return (
    <>
      {showModal(modalVisible, () => {setModalVisible(false)}, setPhoto )}
      {(haveSelfProduce == false) 
      ? 
      <View style={styles.container}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Icon size={150} source={require('../assets/images/surprise.png')}/>
          <View style={{marginTop: 20, alignItems: 'center'}}>
            <Text>자기소개서가 존재하지 않습니다.</Text>
            <Text>나를 소개해보세요</Text>
          </View>
        </View>
        <CustomButton 
          containerStyle={{backgroundColor: colors.point}}
          onPress={createMyResume}
          textStyle={{color: colors.white}}>자기소개서 작성하기
        </CustomButton>
      </View>
      : 
      <ScrollView showsVerticalScrollIndicator={false} style={{backgroundColor: "#F5F5F5"}}>
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
          {/* 아직 정확한 디자인 안나와서 일단 보류 */}
          <View style={styles.sectionTop}>
            <Text style={styles.profileName}>{nickname}</Text>
          </View>

          {/* 기본 정보 섹션 */}
          <View style={styles.section}>
            <View style={styles.sectionTop}>
              <Text style={styles.sectionText}>기본 정보</Text>
              <Icon source={'progress-question'} size={20} color={colors.pastel_point}/>
              <Text style={{...styles.sectionHintText, display: edit ? 'flex' : 'none'}}>프로필에서 수정 가능해요</Text>
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
                      selectedTextStyle: {color: colors.white},
                      unselectedTextStyle: {color: colors.white}
                    }}
                    containerStyle={styles.uneditableTag} 
                    onPress={() => {handleCategorySelect(item.id)}}
                    textStyle={styles.uneditableText} children={item.text}/>
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

          <View style={{...styles.section, flexDirection: 'row'}}>
            <View style={{width: "50%", display: edit ? 'none' : 'flex'}}>
              <CustomButton 
                containerStyle={{backgroundColor: colors.gray4, marginHorizontal: 5}} onPress={deleteAlert}
                textStyle={{color: colors.white}}>삭제하기
              </CustomButton>
            </View>
            <View style={{width: edit ? "100%" : "50%"}}>
              <CustomButton 
                containerStyle={{backgroundColor: colors.point, marginHorizontal: 5}} onPress={() => {setEdit(!edit)}}
                textStyle={{color: colors.white}}>
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
    margin: "6%",
    flex: 1,
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
});

export default SelfProduce;