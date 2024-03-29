import { StyleSheet, View, StyleProp, ViewStyle, TextStyle } from 'react-native';
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
 * @param selectable :SelectableProp. tag를 선택했을 경우, 색깔이 바뀌는 flag, 그리고 tag를 선택, 안 선택했을 때, 적용되는 view, font style 전달
 * @param color :string. style 없이 간단하게 카테고리의 border, text color 전달. 
 * @param children :string. 보여줄 카테고리의 텍스트 내용 전달
 * @param style :StyleProp<ViewStyle>. 카테고리에 부여할 style
 * @param textStyle :StyleProp<TextStyle>. 텍스트에 부여할 style
 */

interface Props extends ChipProps {
  selectable?: SelectableProp
  color?: string
  children: string
  style?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
}

const SelectableCategory = ({ 
  selectable,
  color = colors.gray9,
  children,
  style,
  textStyle,
  ...chipProps
}: Props) => {
  return (
    <View style={[styles.wrapper, {display: (!selectable?.showSelectedOnly || selectable?.select) ? 'flex' : 'none'}]}>
      <Chip
        style={[styles.defaultTag, {borderColor: color}, style, 
          (selectable)&&((selectable.select) ? selectable.selectedStyle : selectable.unselectedStyle)
        ]} 
        textStyle={[styles.defaultText, {color: color}, textStyle,
          (selectable)&&((selectable.select) ? selectable.selectedTextStyle : selectable.unselectedTextStyle)
        ]}
        disabled={selectable?.showSelectedOnly} 
        mode='outlined' children={children}
        {...chipProps}/>
    </View>
    
  );
};

export default SelectableCategory;

const styles = StyleSheet.create({
  defaultTag: {
    borderWidth: 2, 
    margin: 5,
    alignItems: 'center',
    borderRadius: 20,
    borderColor: colors.gray9,
    backgroundColor: colors.white,
  },
  defaultText: {
    fontSize: 14,
    color: colors.gray9, 
  },
  wrapper: {
    flexWrap: 'wrap', 
  }
})