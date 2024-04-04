import { TouchableOpacity, ViewStyle, TouchableOpacityProps, StyleProp, TextStyle, Text, StyleSheet } from 'react-native';
import { colors } from '../assets/colors';


interface Props extends TouchableOpacityProps {
  children: string
  containerStyle?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
}

/**
 * @param children :string. 버튼의 text
 * @param containerStyle :StyleProp<ViewStyle>. container에 부여할 style
 * @param textStyle :StyleProp<TextStyle>. text에 부여할 style
 */
const CustomButton = ({ 
  children, 
  containerStyle,
  textStyle,
  ...touchableOpacityProps
} : Props) => {
  const defaultFontSize = 18;
  const defaultBackgroundColor = colors.point;
  const defaultHeight = 50;

  return (
    <TouchableOpacity style={[styles.defaultContainerStyle, 
      {backgroundColor: defaultBackgroundColor, height: defaultHeight}, containerStyle]}>
      <Text style={[styles.defaultTextStyle, {fontSize: defaultFontSize}, textStyle]}>
        {children}
      </Text>
    </TouchableOpacity>
    );
}

export default CustomButton;

const styles = StyleSheet.create({
  defaultContainerStyle: {
    flexDirection: 'row', 
    alignSelf: 'center', 
    borderRadius: 10
  },
  defaultTextStyle: {
    flex: 1, 
    textAlign: 'center', 
    textAlignVertical: 'center',
    color: colors.gray6
  },
});