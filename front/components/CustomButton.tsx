import { TouchableOpacity, ViewStyle, TouchableOpacityProps, StyleProp, TextStyle, Text, StyleSheet } from 'react-native';
import { colors } from '../assets/colors';


interface Props extends TouchableOpacityProps {
  type?: 'default' | 'fit-content'
  children: string
  containerStyle?: StyleProp<ViewStyle>
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
  const defaultFontSize = 18;
  const defaultBackgroundColor = colors.point;
  const defaultHeight = (type == 'default') ? 50 : 17;

  if (type == 'default') {
    return (
      <TouchableOpacity style={[styles.defaultContainerStyle, 
        {backgroundColor: defaultBackgroundColor, height: defaultHeight},
        containerStyle]}>
        <Text style={[styles.defaultTextStyle, {fontSize: defaultFontSize}, textStyle]}>
          {children}
        </Text>
      </TouchableOpacity>
      );
  }
  else { // fit-content button. 클릭할 수 있는 text button type
    return (
      <TouchableOpacity style={[styles.fitContentContainerStyle, 
        {backgroundColor: defaultBackgroundColor, height: defaultHeight}, containerStyle]}>
        <Text style={[styles.fitContentTextStyle, {fontSize: defaultFontSize}, textStyle]}>
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
    borderRadius: 10
  },
  fitContentContainerStyle: {
    borderRadius: 10, 
    paddingHorizontal: 5,
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