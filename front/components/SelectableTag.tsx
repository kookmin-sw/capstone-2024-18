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
 * @param color :string. style 없이 간단하게 태그의 border, text color 전달
 * @param borderRadius :number. tag와 터치 영역의 borderRadius 전달
 * @param height :number. style 없이 간단하게 태그의 height 전달
 * @param width :number. style 없이 간단하게 태그의 width 전달
 * @param selectable :SelectableProp. 선택 가능한 기능 설정시 필요한 style 전달
 * @param touchAreaStyle :StyleProp<ViewStyle>. 태그 터치 영역에 부여할 style
 * @param containerStyle :StyleProp<ViewStyle>. 태그 컨테이너에 부여할 style
 * @param textStyle :StyleProp<TextStyle>. 텍스트에 부여할 style
 */
interface Props extends ChipProps {
  color?: string
  borderRadius?: number
  /** 
   * Chip component는 자동으로 text height, lineHeight를 안 늘려줘서, 
   * height parameter를 이용하여, 직접 text lineHeight, height 수정
  */
  height?: number
  /** 
   * width 파라미터 대신, containerStyle로 width를 설정할 경우, 
   * text가 중앙 정렬이 안됩니다. 
  */
  width?: number
  selectable?: SelectableProp
  touchAreaStyle?: StyleProp<ViewStyle>
  containerStyle?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
}

const SelectableTag = ({ 
  color = colors.gray9,
  borderRadius = 16,
  height = 25, 
  width,
  selectable,
  touchAreaStyle,
  containerStyle,
  textStyle,
  children,
  ...chipProps
}: Props) => {
  return (
    <View style={[styles.wrapper, {borderRadius: borderRadius}, touchAreaStyle, 
      {display: (!selectable?.showSelectedOnly || selectable?.select) ? 'flex' : 'none'}]}>
      <Chip
        {...chipProps}
        children={children}
        style={[styles.defaultTag, 
          {borderRadius: borderRadius, borderColor: color, height: height}, 
          width ? {width: width} : {}, containerStyle, 
          (selectable)&&((selectable.select) ? selectable.selectedStyle : selectable.unselectedStyle)
        ]}
        textStyle={[styles.defaultText, 
          {color: color, lineHeight: height, height: height}, 
          width ? {flex: 1} : {}, textStyle, 
          (selectable)&&((selectable.select) ? selectable.selectedTextStyle : selectable.unselectedTextStyle)]}
        disabled={selectable?.showSelectedOnly}/>
    </View>
  );
};

export default SelectableTag;

const styles = StyleSheet.create({
  defaultTag: {
    borderWidth: 1,
    borderColor: colors.gray9,
    backgroundColor: colors.white,
    justifyContent: 'center',
  },
  defaultText: {
    color: colors.gray9, 
    fontSize: 14,
    textAlign: 'center',
    marginLeft: 9,
    marginRight: 9,
  },
  wrapper: {
    flexWrap: 'wrap', 
  }
})