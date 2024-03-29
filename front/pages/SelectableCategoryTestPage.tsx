import CustomTextInput from "../components/CustomTextInput";
import { View, Text } from "react-native";
import SelectableCategory from "../components/SelectableCategory";
import { colors } from "../assets/colors";
import { Button } from "react-native-paper";
import { useState } from "react";


const SelectableCategoryTestPage = () => {
  const [ categories, setCategories ] = useState([
    {id: 0, text: 'test', selected: true},
    {id: 1, text: 'test', selected: true},
    {id: 2, text: 'test', selected: false},
    {id: 3, text: 'test', selected: true}
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

  return (
    <View>
      {/* 기본 카테고리 */}
      <Text>기본 카테고리 Test</Text>
      <SelectableCategory children="test"/>

      {/* 기본 카테고리와 색깔 지정 */}
      <Text>기본 카테고리+color Test</Text>
      <SelectableCategory color={colors.point} children="test"/>

      {/* 카테고리 여러 개를 사용하고 싶은 경우 */}
      <Text>카테고리 여러 개 Test</Text>
      <View style={{flexDirection: "row", flexWrap: "wrap"}}>
        <SelectableCategory children="test"/>
        <SelectableCategory children="test"/>
        <SelectableCategory children="test"/>
        <SelectableCategory children="test"/>
      </View>

      {/* 카테고리 선택 기능을 사용하고 싶은 경우 */}
      <Text>select 기능 Test</Text>
      <View style={{flexDirection: "row", flexWrap: "wrap"}}>
        <SelectableCategory children="test" onPress={() => setSelect(!select)}
          selectable={{
            select: select,
            selectedStyle: {backgroundColor: colors.point, borderColor: colors.point}, unselectedStyle: {backgroundColor: colors.gray5, borderColor: colors.gray5},
            selectedTextStyle: {color: colors.white}, unselectedTextStyle: {color: colors.white}
          }}/>
      </View>

      {/* select 세부 기능을 사용하고 싶은 경우 */}
      <Text>select 기능을 응용한 수정 기능 Test</Text>
      <View style={{flexDirection: "row", flexWrap: "wrap"}}>
      {
        categories.map((item) => {
          return (
            <SelectableCategory children={item.text}
              selectable={{
                select: item.selected,
                showSelectedOnly: !edit,
                selectedStyle: {backgroundColor: colors.point, borderColor: colors.point}, unselectedStyle: {backgroundColor: colors.gray5, borderColor: colors.gray5},
                selectedTextStyle: {color: colors.white}, unselectedTextStyle: {color: colors.white}
              }}
              onPress={() => handleCategorySelect(item.id)}
              />
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
  )
}

export default SelectableCategoryTestPage;