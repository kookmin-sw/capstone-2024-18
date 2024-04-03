import { View, Text, StyleSheet, ScrollView } from "react-native";
import SelectableTag from "../components/SelectableTag";
import { colors } from "../assets/colors";
import { Button, PaperProvider, useTheme } from "react-native-paper";
import { useState } from "react";


const SelectableTagTestPage = () => {
  const [ categories, setCategories ] = useState([
    {id: 0, text: 'test', selected: true},
    {id: 1, text: 'test', selected: true},
    {id: 2, text: 'test', selected: false},
    {id: 3, text: 'test', selected: true},
    {id: 4, text: 'test', selected: true},
    {id: 5, text: 'test', selected: true},
    {id: 6, text: 'test', selected: false},
    {id: 7, text: 'test', selected: true},
    {id: 8, text: 'test', selected: true},
    {id: 9, text: 'test', selected: false},
    {id: 10, text: 'test', selected: true},
    {id: 11, text: 'test', selected: true},
    {id: 12, text: 'test', selected: false}
  ]);
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
  const [ edit, setEdit ] = useState(false);
  const [ select, setSelect ] = useState(true);
  const [ buttonText, setButtonText ] = useState<'수정하기'|'저장하기'>('수정하기')

  const theme = useTheme();
  theme.version = 3;

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* 기본 태그 */}
      <View style={styles.container}>
        <Text>기본 태그 Test</Text>
        <SelectableTag children="운동"/>
        <SelectableTag>test</SelectableTag>
      </View>

      {/* 기본 태그와 색깔 지정 */}
      <View style={styles.container}>
        <Text>기본 태그+color Test</Text>
        <SelectableTag children="test" color={colors.point}/>
      </View>

      {/* 태그의 크기 및 style 지정 */}
      <View style={styles.container}>
        <Text>태그의 크기 및 style Test</Text>
        <SelectableTag
          height={100} width={200} borderRadius={20}
          textStyle={{fontSize: 30}} 
          color={colors.point} children="test"/>
      </View>

      {/* 태그 여러 개를 사용하고 싶은 경우 */}
      <View style={styles.container}>
        <Text>태그 여러 개 Test</Text>
        <View style={{flexDirection: "row", flexWrap: "wrap"}}>
          <SelectableTag children="운동" touchAreaStyle={styles.tag}/>
          <SelectableTag children="연애" touchAreaStyle={styles.tag}/>
          <SelectableTag children="음식" touchAreaStyle={styles.tag}/>
          <SelectableTag children="영화" touchAreaStyle={styles.tag}/>
        </View>
      </View>

      {/* 태그 선택 기능을 사용하고 싶은 경우 */}
      <View style={styles.container}>
        <Text>select 기능 Test</Text>
        <View style={{flexDirection: "row", flexWrap: "wrap"}}>
          <SelectableTag children="test" onPress={() => setSelect(!select)}
            selectable={{
              select: select,
              selectedStyle: {backgroundColor: colors.point, borderColor: colors.point}, unselectedStyle: {backgroundColor: colors.gray5, borderColor: colors.gray5},
              selectedTextStyle: {color: colors.white}, unselectedTextStyle: {color: colors.white}
            }}/>
        </View>
      </View>

      {/* select 세부 기능을 사용하고 싶은 경우 */}
      <View style={styles.container}>
        <Text>select 기능을 응용한 수정 기능 Test</Text>
        <View style={{flexDirection: "row", flexWrap: "wrap"}}>
        {
          categories.map((item) => {
            return (
              <SelectableTag children={item.text} key={item.id}
                onPress={() => handleCategorySelect(item.id)}
                touchAreaStyle={styles.tag}
                selectable={{
                  select: item.selected,
                  showSelectedOnly: !edit,
                  selectedStyle: {backgroundColor: colors.point, borderColor: colors.point}, unselectedStyle: {backgroundColor: colors.gray5, borderColor: colors.gray5},
                  selectedTextStyle: {color: colors.white}, unselectedTextStyle: {color: colors.white}
                }}/>
            )
          })
        }
        </View>
        <Button buttonColor={colors.point} textColor={colors.white} children={buttonText}
          onPress={() => {
            setEdit(!edit); 
            if (buttonText == '수정하기') { setButtonText('저장하기');}
            else { setButtonText('수정하기'); }
          }}/>
      </View>
    </ScrollView>
  )
}

export default SelectableTagTestPage;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.gray2,
    margin: 10, 
    paddingHorizontal: 10, 
    paddingVertical: 20, 
    borderRadius: 20
  }, 
  tag: {
    marginRight: 5, 
    marginBottom: 5,
  }
});