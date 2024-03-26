import { TouchableOpacity, View, ViewStyle } from 'react-native';


interface ButtonProps {
  children: React.ReactNode
  onPress(): void
  styles?: ViewStyle
}

/**
 * 
 * @param children :React.ReactNode. 버튼 안에 표시할 내용물. ex) Text, Image
 * @param onPress :function. 버튼 클릭 시 실행 할 함수
 * @param styles :ViewStyle. 추가하고 싶은 style이 있을 경우 추가
 */
const CustomButton = ({ children, onPress, styles} : ButtonProps) => {
  return (
    <View style={{flexDirection: 'row', alignSelf: 'center'}}>
      <TouchableOpacity onPress={onPress} style={[{alignItems: "center", borderRadius: 10, padding: 14.5, flex: 1}, styles]}>
        {children}
      </TouchableOpacity>
  </View>);
}

export default CustomButton;