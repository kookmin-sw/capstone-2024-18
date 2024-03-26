import { View, StyleSheet, Text, StyleProp, ViewStyle } from "react-native";
import { colors } from '../assets/colors.tsx'
import { Icon } from 'react-native-paper';

/**
 * @param source :string | { uri: string } | React.ReactElement. 아이콘 정의
 *    - string: 아이콘 이름 목록 참조 https://callstack.github.io/react-native-paper/docs/guides/icons/
 *    - { uri: string }: 아이콘 경로 전달
 *    - React.ReactElement: ReactElement를 아이콘으로 사용
 * 
 * @param size :number. 아이콘의 크기
 * @param color :string. 아이콘의 색상
 */

interface IconProp {
  source: string
  size?: number
  color?: string
}

/**
 * @param icon :IconProp. 왼쪽에 삽입될 아이콘
 * @param containerStyle: StyleProp<ViewStyle>. container에 부여할 style
 * @param textStyle :StyleProp<ViewStyle>. text에 부여할 style
 * @param children :any. 표시될 텍스트 내용
 */

interface Props {
  icon: IconProp
  containerStyle?: StyleProp<ViewStyle>
  textStyle?: StyleProp<ViewStyle>
  children?: any
}

const IconText = ({icon, containerStyle, textStyle, children} : Props) => {
  const { source, size=12, color=colors.gray6 } = icon;
  return (
    <View style={[style.container, containerStyle]}>
      <Icon source={source} size={size} color={color} />
      <Text style={[style.text, textStyle]}>{children}</Text>
    </View>
  );
}

export default IconText;

const style = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    fontSize: 12, 
    fontFamily: "Pretendard-Regular",
    color: colors.gray6, 
    marginLeft: 4,
  },
})