import { forwardRef } from "react";
import { View, ScrollView, StyleSheet, TextInput, StyleProp, ViewStyle, Pressable, PressableProps } from "react-native";
import { Icon, TextInputProps } from 'react-native-paper';

import { colors } from '../assets/colors.tsx'

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
  source: string | { uri: string } | React.ReactElement;  
  size?: number
  color?: string
}

/**
 * @param leftIcon :IconProp. 왼쪽에 삽입될 아이콘
 * @param rightIcon :IconProp. 오른쪽에 삽입될 아이콘
 * @param leftPressable :PressableProps. 아이콘에 onPress 등 인자를 전달
 * @param rightPressable :PressableProps. 아이콘에 onPress 등 인자를 전달
 * @param containerStyle: StyleProp<ViewStyle>. container에 부여할 style
 * @param textInputStyle :StyleProp<ViewStyle>. textInput에 부여할 style
 */

interface Props extends TextInputProps {
  leftIcon?: IconProp
  rightIcon?: IconProp
  leftPressable?: PressableProps
  rightPressable?: PressableProps
  containerStyle?: StyleProp<ViewStyle>
  textInputStyle?: StyleProp<ViewStyle>
}

const CustomTextInput = forwardRef<TextInput | null, Props>(({ 
  leftIcon, 
  rightIcon, 
  leftPressable, 
  rightPressable, 
  containerStyle, 
  textInputStyle, 
  ...textInputProps 
}: Props, ref) => {

  const defaultIconProps = { size: 20, color: colors.gray6 }
  const defalutTextInputProps = { placeholderTextColor: colors.gray5 }

  return (
    <View style={[styles.container, containerStyle]}>
      {leftIcon && <Pressable {...leftPressable}>
        <Icon {...defaultIconProps} {...leftIcon} />
      </Pressable>}
      <ScrollView contentContainerStyle={styles.scrollContainer} horizontal={true}>
        <TextInput ref={ref} style={[styles.textInput, textInputStyle]} {...defalutTextInputProps} {...textInputProps} />
      </ScrollView>
      {rightIcon && <Pressable {...rightPressable}>
        <Icon {...defaultIconProps} {...rightIcon} />
      </Pressable>}
    </View>
  );
});

export default CustomTextInput;

const styles = StyleSheet.create({
  container: {
    borderRadius: 10, 
    paddingHorizontal: 10,
    backgroundColor: colors.gray1, 
    flexDirection: "row",
    alignItems: "center",
    height: 40,
    borderWidth: 1,
    borderColor: colors.gray1,
  },
  scrollContainer: {
    flex: 1,
  },
  textInput: {
    color: colors.gray7, 
    fontFamily: "Pretendard-Regular",
    fontSize: 14,
    flex: 1,
    height: 25,
    padding: 0,
  },
})