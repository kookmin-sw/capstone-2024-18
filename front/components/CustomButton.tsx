import { TouchableOpacity, ViewStyle, TouchableOpacityProps, StyleProp, TextStyle, Text, StyleSheet, DimensionValue, ColorValue } from 'react-native';
import { colors } from '../assets/colors';


interface BtnContainerStyle extends ViewStyle {
  height: DimensionValue | undefined
  backgroundColor: ColorValue | undefined;
}

interface BtnTextStyle extends TextStyle {
  fontSize: number | undefined;
}


interface Props extends TouchableOpacityProps {
  type?: 'default' | 'fit-content'
  children: string
  containerStyle: StyleProp<BtnContainerStyle>,
  textStyle: StyleProp<BtnTextStyle>
}

/**
 * @param type :'default'|'fit-content'. 버튼의 type을 지정
 * @param children :string. 버튼의 text
 * @param containerStyle :StyleProp<BtnViewStyle>. container에 부여할 style
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

  if (type == 'default') {
    return (
      <TouchableOpacity style={[styles.defaultContainerStyle, 
        containerStyle]}>
        <Text style={[styles.defaultTextStyle,  textStyle]}>
          {children}
        </Text>
      </TouchableOpacity>
      );
  }
  else { // fit-content button. 클릭할 수 있는 text button type
    return (
      <TouchableOpacity style={[styles.fitContentContainerStyle, 
        containerStyle]}>
        <Text style={[styles.fitContentTextStyle, textStyle]}>
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