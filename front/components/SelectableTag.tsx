import { StyleSheet, View, StyleProp, ViewStyle, TextStyle, Text, DimensionValue } from 'react-native';
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
 * @param color :string. style 없이 간단하게 태그의 border, text color 전달. 
 * @param borderRadius :number | undefined. tag와 터치 영역의 borderRadius 전달
 * @param height :number | undefined. style 없이 간단하게 태그의 height 전달. 
 * @param selectable :SelectableProp. 선택 가능한 기능 설정시 필요한 style 전달
 * @param touchAreaStyle :StyleProp<ViewStyle>. 태그 터치 영역에 부여할 style
 * @param containerStyle :StyleProp<ViewStyle>. 태그 컨테이너에 부여할 style
 * @param textStyle :StyleProp<TextStyle>. 텍스트에 부여할 style
 */
interface Props extends ChipProps {
  color?: string
  borderRadius?: number | undefined
  /** 
   * Chip component는 자동으로 text height, lineHeight를 안 늘려줘서, 
   * height parameter를 이용하여, 직접 text lineHeight, height 수정
  */
  height?: number | undefined
  selectable?: SelectableProp
  touchAreaStyle?: StyleProp<ViewStyle>
  containerStyle?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
}

const SelectableTag = ({ 
  color = colors.gray9,
  borderRadius = 20,
  height = 25, 
  selectable,
  touchAreaStyle,
  containerStyle,
  textStyle,
  ...chipProps
}: Props) => {
  const defaultFontSize = 14;
  const defaultHeight = height; 
  const defaultBorderRadius = borderRadius;

  return (
    <View style={[styles.wrapper, {borderRadius: defaultBorderRadius}, touchAreaStyle, 
      {display: (!selectable?.showSelectedOnly || selectable?.select) ? 'flex' : 'none'}]}>
      <Chip
        {...chipProps}
        style={[styles.defaultTag, {borderRadius: defaultBorderRadius, borderColor: color, height: defaultHeight}, 
          containerStyle, (selectable)&&((selectable.select) ? selectable.selectedStyle : selectable.unselectedStyle)
        ]}
        textStyle={[styles.defaultText, {color: color}, textStyle, 
          {fontSize: defaultFontSize, lineHeight: defaultHeight, height: defaultHeight},
          (selectable)&&((selectable.select) ? selectable.selectedTextStyle : selectable.unselectedTextStyle)]}
        disabled={selectable?.showSelectedOnly}/>
    </View>
  );
};

export default SelectableTag;

const styles = StyleSheet.create({
  defaultTag: {
    borderWidth: 2, 
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