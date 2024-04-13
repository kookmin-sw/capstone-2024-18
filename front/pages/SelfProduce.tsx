import { View, Text, ScrollView, StyleSheet, Dimensions, Alert, StyleProp, ViewStyle, ImageSourcePropType, Modal } from 'react-native';
import { Icon, Chip } from 'react-native-paper';
import { colors } from '../assets/colors.tsx'
import CustomButton from '../components/CustomButton';
import React, { useEffect, useState } from 'react';
import CustomTextInput from '../components/CustomTextInput.tsx';
import ImageWithIconOverlay from '../components/ImageWithIconOverlay.tsx';
import CarouselSlider from '../components/CarouselSlider.tsx';
import SelectableTag from '../components/SelectableTag.tsx';
import { showModal } from '../components/CameraComponent.tsx';

// 이미지들의 고유 key를 임시로 주기 위한 라이브러리
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';


const SelfProduce = () => {
  const [ haveSelfProduce, setHaveSelfProduce ] = useState(true);

  // 자기소개서 edit 기능 조절 변수
  const [ edit, setEdit ] = useState(false);

  // CarouselSlider의 필수 파라미터, pageWidth, offset, gap 설정
  const width = Dimensions.get('window').width;
  const [ pageWidth, setPageWidth ] = useState(width);
  const [ offset, setOffset ] = useState(0);
  const [ gap, setGap ] = useState({leftGap: 0, rightGap: 0, topGap: 0, bottomGap: 0});

  // 현재 이미지 슬라이더의 페이지를 알기 위한 페이지 설정
  const [ page, setPage ] = useState(0);

  // 이미지 추가하는 방식 모달 가시성 설정
  const [ modalVisible, setModalVisible ] = useState(false);

  // 이미지 슬라이더의 내부 contents 설정
  const [ images, setImages ] = useState([
    {
      id: uuidv4(),
      type: 'basic',
      source: require('../assets/images/Jenny_image.png'),
    },
    {
      id: uuidv4(),
      type: 'basic',
      source: require('../assets/images/Jenny_image.png')
    },
    {
      id: uuidv4(),
      type: 'image',
      source: require('../assets/images/imageTest1.png')
    },
  ]);

  function setPhoto(uri: string) {
    handleAddImageAtIndex(images.length-1, {id: images.length, type: 'image', source: {uri: uri}})
  }

  // 이미지 추가하는 방식(사진 찍기, 갤러리에서 사진 가져오기) 모달 보여주기
  function takePhoto() {
    setModalVisible(true);
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

  const handleAddImageAtIndex = (index: number, newImage: any) => {
    // splice() 메서드를 사용하여 데이터의 특정 인덱스에 새로운 원소를 추가합니다.
    const newImages = [...images];
    newImages.splice(index, 0, newImage);

    // 변경된 배열을 상태로 업데이트합니다.
    setImages(newImages);
  };

  const handleDeleteImageWidthId = (id: string) => {
    const newData = images.filter(image=> image.id !== id);
    setImages(newData);
  };

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

  // 기본 정보, 관상 정보, 카테고리 정보, 자기소개서 내용
  const [ basic, setBasic ] = useState([
    {id: 0, text: "여성"},
    {id: 1, text: "20대 중반"},
    {id: 2, text: "170cm 중반"},
    {id: 3, text: "서울 강북"}
  ])
  const [ face, setFace ] = useState([
    {id: 0, text: "머리가 빼어남"},
    {id: 1, text: "담대한"},
    {id: 2, text: "모험심이 강함"},
    {id: 3, text: "영리함"}
  ])
  const [ categories, setCategories ] = useState([
    {id: 0, text: "운동", selected: true},
    {id: 1, text: "음식", selected: false},
    {id: 2, text: "영화", selected: false},
    {id: 3, text: "패션", selected: true},
    {id: 4, text: "공부", selected: true},
    {id: 5, text: "연애", selected: true},
    {id: 6, text: "음악", selected: true},
    {id: 7, text: "자유", selected: true},
  ])
  const [ essay, setEssay ] = useState('안녕하세요! 저는 Anna 이에요!\n저는 서울 소재 대학교에서 4학년 재학 중인 Jenny에요!\n저는 평일에 학교 근처에서 복싱장을 같이 다닐 사람을 구하고 있어요! 혼자 다니면 금방 질려서 그만두게 되더라구요.\n복싱장을 다녀온 이후에는 가볍게 맥주 한잔 정도는 괜찮은 것 같아요!\n\n대화를 나눠보고 찐친이 될 가능성이 보인다면 AI 관상을 지울게요~~');

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
          onPress: () => deleteSelfProduce()
        }
      ])
  }

  function deleteSelfProduce() {
    // UI 상에서 자기소개 만들기
    setHaveSelfProduce(false);

    // 자기소개서 삭제하는 요청 전송
  }

  return (
    (haveSelfProduce == false) 
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
          onPress={()=>{setHaveSelfProduce(!haveSelfProduce)}}
          textStyle={{color: colors.white}}>자기소개서 작성하기
        </CustomButton>
      </View>
      : 
    <>
      {showModal(modalVisible, () => {setModalVisible(false)}, setPhoto )}
      <ScrollView showsVerticalScrollIndicator={false} style={{backgroundColor: "#F5F5F5"}}>
        {/* 이미지 슬라이더 */}
        <CarouselSlider
          pageWidth={pageWidth}
          pageHeight={pageWidth}
          offset={offset}
          gap={gap}
          data={images}
          onPageChange={setPage}
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

        {/* 프로필 사진, 이름 섹션 */}
        <View style={styles.container} >
          <View style={styles.sectionTop}>
            <Icon size={60} source={require('../assets/images/Jenny_image.png')}/>
            <Text style={styles.profileName}>Jenny</Text>
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
              face.map((item) => {
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
              <Text style={styles.sectionText}>내용</Text>
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
                containerStyle={{backgroundColor: colors.gray4, marginHorizontal: 5}} onPress={() => {deleteAlert()}}
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
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: "6%",
    flex: 1,
  },
  modalContainer: {
    // flex: 1,
    height: 300,
    backgroundColor: 'black',
  },
  profileName: {
    marginLeft: 15, 
    fontSize: 15, 
    color: '#000000', 
    alignSelf: 'center'
  },
  uneditableTag: {
    borderWidth: 1, 
    borderColor: colors.point,
    backgroundColor: colors.white,
    alignItems: 'center',
    borderRadius: 20
  },
  unselectedTag: {
    borderWidth: 1, 
    borderColor: colors.point,
    backgroundColor: colors.point,
    alignItems: 'center',
    borderRadius: 20
  },
  uneditableText: {
    color: colors.gray7, 
    fontSize: 14,
    marginLeft: 9,
    marginRight: 9
  },
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
  inputContainer: {
    backgroundColor: colors.gray2, 
    marginVertical: 10, 
    marginHorizontal:0, 
    padding: 15, 
    borderRadius: 15,
    height: undefined
  },
  tagContainer: {
    flexDirection: "row", 
    flexWrap: "wrap"
  }, 
  tagWrapper: {
    margin: 5, 
    flexWrap: 'wrap', 
  },
  selectedTag: {
    backgroundColor: colors.point,
    borderColor: colors.point
  }, 
  selectedTagText: {
    color: colors.white
  },
  unselectedTagText: {
    color: "#9E9E9E"
  }
});

export default SelfProduce;