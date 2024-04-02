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

  const theme = useTheme();
  theme.version = 3;

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* 기본 카테고리 */}
      <View style={styles.container}>
        <Text>기본 카테고리 Test</Text>
        <SelectableTag children="test"/>
      </View>

      {/* 기본 카테고리와 색깔 지정 */}
      <View style={styles.container}>
        <Text>기본 카테고리+color Test</Text>
        <SelectableTag color={colors.point} children="test"/>
      </View>

      {/* 카테고리의 크기 및 style 지정 */}
      {/* width 지정 시, textStyle을 이렇게 설정해야 글씨가 가로 중앙 정렬 됩니다 */}
      <View style={styles.container}>
        <Text>카테고리의 크기 및 style Test</Text>
        <SelectableTag
          containerStyle={{width: 200, height: 100}}
          textStyle={{flex: 1, textAlign: 'center'}} 
          color={colors.point} children="test"/>
      </View>

      {/* 카테고리의 텍스트 크기 지정 */}
      {/* 주의 
        fontSize 파라미터를 이용하는 것이 아닌, 
        textStyle을 이용해서 fontSize를 조절할 경우,
        lineHeight를 직접 조절해야합니다. 
       */}
      <View style={styles.container}>
        <Text>카테고리의 fontSize Test</Text>
        <PaperProvider theme={theme}>
          <SelectableTag color={colors.point} fontSize={50}
            children={'style'}/>
        </PaperProvider>
      </View>

      {/* 카테고리 여러 개를 사용하고 싶은 경우 */}
      <View style={styles.container}>
        <Text>카테고리 여러 개 Test</Text>
        <View style={{flexDirection: "row", flexWrap: "wrap"}}>
          <SelectableTag children="test"/>
          <SelectableTag children="test"/>
          <SelectableTag children="test"/>
          <SelectableTag children="test"/>
        </View>
      </View>

      {/* 카테고리 선택 기능을 사용하고 싶은 경우 */}
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
  }
});