import { StyleSheet, View, StyleProp, ViewStyle, TextStyle, Text } from 'react-native';
import { Chip, ChipProps } from 'react-native-paper';
import { colors } from '../assets/colors.tsx'


/**
 * @param select :boolean. 선택 여부를 결정하는 flag
 * @param showSelectedOnly :boolean. 선택된 카테고리만 보여주는 속성
 * @param selectedStyle :StyleProp<ViewStyle>. 선택이 되었을 때 보이는 스타일 속성
 * @param unselectedStyle :StyleProp<ViewStyle>. 선택이 안 되었을 때 보이는 스타일 속성
 * @param selectedTextStyle :StyleProp<TextStyle>. 선택이 되었을 때 보이는 텍스트 속성
 * @param unselectedTextStyle :StyleProp<TextStyle>. 선택이 안 되었을 때 보이는 텍스트 속성
 */
interface SelectableProp {
  select: boolean
  showSelectedOnly?: boolean
  selectedStyle: StyleProp<ViewStyle>
  unselectedStyle: StyleProp<ViewStyle>
  selectedTextStyle: StyleProp<TextStyle>
  unselectedTextStyle: StyleProp<TextStyle>
}

/**
 * @param color :string. style 없이 간단하게 카테고리의 border, text color 전달. 
 * @param fontSize :number. style 없이 간단하게 카테고리 text의 fontSize 전달. 
 * @param selectable :SelectableProp. 선택 가능한 기능 설정시 필요한 style 전달
 * @param containerStyle :StyleProp<ViewStyle>. 카테고리 컨테이너에 부여할 style
 * @param textStyle :StyleProp<TextStyle>. 텍스트에 부여할 style
 */
interface Props extends ChipProps {
  color?: string
  fontSize?: number
  selectable?: SelectableProp
  containerStyle?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
}

const SelectableTag = ({ 
  color = colors.gray9,
  fontSize = 14,
  selectable,
  containerStyle,
  textStyle,
  ...chipProps
}: Props) => {
  const defaultHeight = Math.max(25, fontSize);

  return (
    <View style={[styles.wrapper, {display: (!selectable?.showSelectedOnly || selectable?.select) ? 'flex' : 'none'}]}>
      <Chip
        style={[styles.defaultTag, {borderColor: color, height: defaultHeight}, containerStyle, 
          (selectable)&&((selectable.select) ? selectable.selectedStyle : selectable.unselectedStyle)
        ]} 
        textStyle={[styles.defaultText, {color: color}, textStyle, 
          {fontSize: fontSize, lineHeight: fontSize + 3, height: fontSize + 3},
          (selectable)&&((selectable.select) ? selectable.selectedTextStyle : selectable.unselectedTextStyle)]}
        disabled={selectable?.showSelectedOnly} 
        mode='outlined' 
        {...chipProps}>
        </Chip>
    </View>
    
  );
};

export default SelectableTag;

const styles = StyleSheet.create({
  defaultTag: {
    borderWidth: 2, 
    margin: 5,
    borderRadius: 10,
    borderColor: colors.gray9,
    backgroundColor: colors.white,
    justifyContent: 'center',
  },
  defaultText: {
    color: colors.gray9, 
  },
  wrapper: {
    flexWrap: 'wrap', 
  }
})