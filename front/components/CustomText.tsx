import { Text, TextStyle } from 'react-native';


interface TextProps {
  children: string
  style?: TextStyle
}


/**
 * 
 * @param children :string. 표시할 string
 * @param style :TextStyle. 추가하고 싶은 style이 있을 경우 추가
 */
const CustomText = ({ children, style} : TextProps) => {
  return (
    <Text style={style}>
      {children}
    </Text>
  );
}

export default CustomText;