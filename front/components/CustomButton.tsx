import { TouchableOpacity, ViewStyle, TouchableOpacityProps, StyleProp, TextStyle, Text, StyleSheet } from 'react-native';
import { colors } from '../assets/colors';


interface Props extends TouchableOpacityProps {
  type?: 'default' | 'fit-content'
  children: string
  containerStyle?: StyleProp<ViewStyle>,
  textStyle?: StyleProp<TextStyle>
}

/**
 * @param type :'default'|'fit-content'. 버튼의 type을 지정
 * @param children :string. 버튼의 text
 * @param containerStyle :StyleProp<ViewStyle>. container에 부여할 style
 * @param textStyle :StyleProp<TextStyle>. text에 부여할 style
 */
const CustomButton = ({ 
  type='default', 
  children, 
  containerStyle,
  textStyle,
  ...touchableOpacityProps
} : Props) => {
  const defaultFontSize = 14;
  function getButtonHeight(fontSize: number) {
    if (type == 'default') {
      return fontSize * 2.4;
    } else {
      return fontSize * 1.5;
    }
  }
  
  // 사용자가 설정한 textStyle에서 fontSize 설정한 값이 있으면 가져오기.
  // 설정한 fontSize가 없으면, 자동으로, 기본 설정 fontSize를 사용합니다. 
  let fontSize = defaultFontSize;
  if (Array.isArray(textStyle)) {
    if (textStyle[0] && typeof textStyle[0] === 'object' && 'fontSize' in textStyle[0]) {
      fontSize = textStyle[0].fontSize;
    }
  } else {
    if (typeof textStyle === 'object' && textStyle && 'fontSize' in textStyle) {
      fontSize = textStyle?.fontSize;
    }
  }


  // 사용자가 설정한 containerSytle에서 height 가져오기. 
  // 설정한 height가 없으면, 자동으로, 버튼의 height는 fontSize를 기반해서 정해집니다. 
  let height = getButtonHeight(fontSize);
  if (Array.isArray(containerStyle)) {
    if (containerStyle[0]?.height) {
      height = Math.max(height, containerStyle[0]?.height);
    }
  } else {
    if (containerStyle?.height) {
      height = Math.max(height, containerStyle?.height);
    }
  }

  if (type == 'default') {
    return (
      <TouchableOpacity style={[styles.defaultContainerStyle, 
        containerStyle, {height: height}]}>
        <Text style={[styles.defaultTextStyle, {fontSize: fontSize}, textStyle]}>
          {children}
        </Text>
      </TouchableOpacity>
      );
  }
  else { // fit-content button. 클릭할 수 있는 text button type
    return (
      <TouchableOpacity style={[styles.fitContentContainerStyle, 
        containerStyle, {height: height}]}>
        <Text style={[styles.fitContentTextStyle, {fontSize: fontSize}, textStyle]}>
          {children}
        </Text>
      </TouchableOpacity>
    );
  }
}

export default CustomButton;

const styles = StyleSheet.create({
  defaultContainerStyle: {
    flexDirection: 'row', 
    alignSelf: 'center', 
    backgroundColor: colors.point,
    borderRadius: 10
  },
  fitContentContainerStyle: {
    borderRadius: 10, 
    paddingHorizontal: 5,
    backgroundColor: colors.point,
    justifyContent: 'center'
  },
  defaultTextStyle: {
    flex: 1, 
    textAlign: 'center', 
    textAlignVertical: 'center',
    color: colors.gray6
  },
  fitContentTextStyle: {
    color: colors.gray6,
  }
});