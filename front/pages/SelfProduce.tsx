import { View, Text, ScrollView } from 'react-native';
import { ImageSlider } from "react-native-image-slider-banner";
import { Card, Icon, Chip } from 'react-native-paper';
import { colors } from '../assets/colors.tsx'
import CustomButton from '../components/CustomButton';
import { useState } from 'react';
import CustomTextInput from '../components/CustomTextInput.tsx';


const SelfProduce = () => {
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
  const [ basic, setBasic ] = useState([
    {id: 0, text: "여"},
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
  const selectedColor = colors.point;
  const unselectedColor = "#9E9E9E";

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
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* ImageSlider 아직 디자인이 fix 안 되었기 때문에, 아무 slider와 이미지 씁니다 */}
      <ImageSlider 
        data={[
          {img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5a5uCP-n4teeW2SApcIqUrcQApev8ZVCJkA&usqp=CAU'},
          {img: 'https://thumbs.dreamstime.com/b/environment-earth-day-hands-trees-growing-seedlings-bokeh-green-background-female-hand-holding-tree-nature-field-gra-130247647.jpg'},
          {img: 'https://cdn.pixabay.com/photo/2015/04/19/08/32/marguerite-729510__340.jpg'}
        ]}
        autoPlay={false}
        onItemChanged={(item) => console.log("item", item)}
        closeIconColor="#fff"
        caroselImageStyle={{height: 268}}
      />
      <View style={{padding: 20}}>
        <Card.Title 
          left={(props) => <Icon {...props} source="folder"/>} 
          title="Anna"
          style={{backgroundColor: colors.gray4}}
          />

        <View style={{paddingVertical: 20, height: "100%"}}>
          <Text>기본 정보</Text>
          
          <View style={{flexDirection: "row", flexWrap: "wrap"}}>
            {
              basic.map((item, idx) => {
                return (
                  <View key={item.id} style={{margin: 5, flexWrap: 'wrap'}}>
                    <Chip 
                      style={{backgroundColor: colors.pastel_point, height: 30}} 
                      textStyle={{ color: colors.point, fontSize: 15 }}
                      children={item.text}/>
                  </View>
                );
              })
            }
          </View>
          
          <Text>관상 정보</Text>
          <View style={{flexDirection: "row", flexWrap: "wrap"}}>
            {
              face.map((item) => {
                return (
                  <View key={item.id} style={{margin: 5, flexWrap: 'wrap'}}>
                    <Chip 
                      style={{backgroundColor: colors.pastel_point, height: 30}} 
                      textStyle={{ color: colors.point, fontSize: 15 }}
                      children={item.text}/>
                  </View>
                );
              })
            }
          </View>

          <Text>카테고리</Text>
          <View style={{flexDirection: "row", flexWrap: "wrap"}}>
          {
            categories.map((item) => {
              return (
                <View key={item.id} style={{margin: 5, flexWrap: 'wrap', display: (edit || item.selected) ? 'flex': 'none'}}>
                  <Chip 
                    style={{backgroundColor: colors.white, borderColor: item.selected ? selectedColor : unselectedColor, borderWidth: 2, height: 30}} 
                    mode='outlined'
                    onPress={() => {handleCategorySelect(item.id);}}
                    textStyle={{ color: item.selected ? selectedColor : unselectedColor, fontSize: 15, marginTop: 0 }}
                    children={item.text}/>
                </View> 
              );
            })
          }
          </View>

          <Text>내용</Text>
          <CustomTextInput 
            containerStyle={{backgroundColor: colors.gray2, marginVertical: 10, marginHorizontal:0, padding: 15, borderRadius: 15}} 
            style={{flex: 1}} multiline={true}
            textColor={"#000000"}
            editable={edit ? true : false}
            placeholderTextColor={"#000000"}>
            안녕하세요! 저는 Anna 이에요!
            저는 판교 소재의 IT 회사에서 근무하고 있어요.
            저는 주말에 테니스를 같이 칠 사람을 구하고 있어요. 장소는 서울이면 좋겠어요. 성남에는 좋은 테니스장이 없더라구요~
            테니스 친 이후에는 가볍게 맥주 한잔 정도는 괜찮은 것 같아요!
            대화를 나눠보고 찐친이 될 가능성이 보인다면 AI 관상을 지울게요~~
          </CustomTextInput>

          <View style={{flexDirection: 'row', width: "50%"}}>
            <CustomButton styles={{backgroundColor: colors.point}} onPress={() => {}}><Text>삭제하기</Text></CustomButton>
            <CustomButton styles={{backgroundColor: colors.point}} onPress={() => {setEdit(!edit)}}>
              {
                edit ? 
                  <Text>저장하기</Text> : 
                  <Text>수정하기</Text>
              }
            </CustomButton>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default SelfProduce;