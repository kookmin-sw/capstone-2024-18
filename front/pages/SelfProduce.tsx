import { View, Text, ScrollView, StyleSheet, Dimensions, Alert } from 'react-native';
import { ImageSlider } from "react-native-image-slider-banner";
import { Icon, Chip } from 'react-native-paper';
import { colors } from '../assets/colors.tsx'
import CustomButton from '../components/CustomButton';
import { useState } from 'react';
import CustomTextInput from '../components/CustomTextInput.tsx';


const SelfProduce = () => {
  const { width } = Dimensions.get('window');

  const selectedColor = colors.point;
  const unselectedColor = colors.white;
  const selectedFontColor = colors.white;
  const unselectedFontColor = "#9E9E9E";
  const selectedBorderColor = colors.point;
  const unselectedBorderColor = "#9E9E9E";

  const [ haveSelfProduce, setHaveSelfProduce ] = useState(true);

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
  const [ edit, setEdit ] = useState(false);
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

  function deleteAlert() {
    Alert.alert(
      "정말 자기소개서를 삭제하시겠습니까?", 
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
    (haveSelfProduce == false) ? 
      <>
        <View style={styles.container}>

          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Icon size={150} source={require('../assets/images/surprise.png')}/>
            <View style={{marginTop: 20, alignItems: 'center'}}>
              <Text>자기소개서가 존재하지 않습니다.</Text>
              <Text>나를 소개해보세요</Text>
            </View>
          </View>
          <CustomButton 
            styles={{backgroundColor: colors.point}}
            onPress={()=>{setHaveSelfProduce(!haveSelfProduce)}}>
            <Text style={{color: colors.white}}>자기소개서 작성하기</Text>
          </CustomButton>
        </View>

      </> :
    
      <ScrollView showsVerticalScrollIndicator={false} style={{backgroundColor: "#F5F5F5"}}>
        {/* 사진 편집 기능 때문에, ImageSlider 따로 구현할 예정이기 때문에, 아무 slider 씁니다 */}
        <ImageSlider 
          data={[
            {img: require('../assets/images/imageTest1.png')},
            {img: require('../assets/images/imageTest1.png')},
            {img: require('../assets/images/imageTest1.png')},
          ]}
          localImg={true}
          caroselImageStyle={{ resizeMode: 'cover', height: width}}
        />

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
              basic.map((item, idx) => {
                return (
                  <View key={item.id} style={styles.tagWrapper}>
                    <Chip 
                      style={styles.uneditableTag} textStyle={styles.uneditableText}
                      children={item.text}/>
                  </View>
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
                  <View key={item.id} style={styles.tagWrapper}>
                    <Chip 
                      style={styles.uneditableTag} textStyle={styles.uneditableText}
                      children={item.text}/>
                  </View>
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
                  <View key={item.id} style={[styles.tagWrapper, {display: (edit || item.selected) ? 'flex': 'none'}]}>
                    <Chip 
                      style={[styles.editableTag, {
                        backgroundColor: item.selected ? selectedColor : unselectedColor, 
                        borderColor: item.selected ? selectedBorderColor : unselectedBorderColor
                      }]} 
                      textStyle={[styles.editableText, {
                        color: item.selected ? selectedFontColor : unselectedFontColor, 
                      }]}
                      mode='outlined' children={item.text}
                      onPress={() => {handleCategorySelect(item.id)}} />
                  </View> 
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
              onChangeText={(text) => {setEssay(text);}}
              children={essay}/>
          </View>

          <View style={{...styles.section, flexDirection: 'row'}}>
            <View style={{width: "50%", display: edit ? 'none' : 'flex'}}>
              <CustomButton styles={{backgroundColor: colors.gray4, marginHorizontal: 5}} onPress={() => {deleteAlert()}}>
                <Text style={{color: colors.white}}>삭제하기</Text>
              </CustomButton>
            </View>
            <View style={{width: edit ? "100%" : "50%"}}>
              <CustomButton styles={{backgroundColor: colors.point, marginHorizontal: 5}} onPress={() => {setEdit(!edit)}}>
              {
                edit ? 
                  <Text style={{color: colors.white}}>완료</Text> : 
                  <Text style={{color: colors.white}}>수정하기</Text>
              }
              </CustomButton>
            </View>
          </View>
        </View>
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: "8%",
    flex: 1,
  },
  profileName: {
    marginLeft: 15, 
    fontSize: 15, 
    color: '#000000', 
    alignSelf: 'center'
  },
  uneditableTag: {
    borderWidth: 1.6, 
    borderColor: colors.point,
    backgroundColor: colors.white,
    alignItems: 'center',
    borderRadius: 20
  },
  editableTag: {
    borderWidth: 2, 
    alignItems: 'center',
    borderRadius: 20
  },
  uneditableText: {
    color: colors.gray7, 
    fontSize: 14
  },
  editableText: {
    fontSize: 14
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
    borderRadius: 15
  },
  tagContainer: {
    flexDirection: "row", 
    flexWrap: "wrap"
  }, 
  tagWrapper: {
    margin: 5, 
    flexWrap: 'wrap', 
  }
});

export default SelfProduce;