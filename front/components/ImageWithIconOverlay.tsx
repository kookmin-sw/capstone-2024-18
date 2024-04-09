import { StyleSheet, View, StyleProp, ViewStyle, PressableProps, ImageBackground, Pressable, Dimensions, ImageBackgroundProps } from "react-native";
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
  source: string | { uri: string } | React.ReactElement;  
  size?: number
  color?: string
}

/**
 * @param borderRadius :number. background에 적용될 borderRadius
 * @param leftIcon :IconProp. 왼쪽에 삽입될 아이콘
 * @param rightIcon :IconProp. 오른쪽에 삽입될 아이콘
 * @param centerIcon :IconProp. 가운데에 삽입될 아이콘
 * @param leftPressable :PressableProps. 아이콘에 onPress 등 인자를 전달
 * @param rightPressable :PressableProps. 아이콘에 onPress 등 인자를 전달
 * @param centerPressable :PressableProps. 아이콘에 onPress 등 인자를 전달
 * @param containerStyle :StyleProp<ViewStyle>. 이미지, 아이콘을 에 부여할 style
 */

interface Props extends ImageBackgroundProps {
  leftIcon?: IconProp
  rightIcon?: IconProp
  centerIcon?: IconProp
  leftPressable?: PressableProps
  rightPressable?: PressableProps
  centerPressable?: PressableProps
  containerStyle?: StyleProp<ViewStyle>
  children?: React.ReactNode
}

const ImageWithIconOverlay = ({ 
  leftIcon, 
  rightIcon, 
  centerIcon,
  leftPressable, 
  rightPressable, 
  centerPressable,
  containerStyle,
  children,
  ...imageBackgroundProps
}: Props) => {
  const { width } = Dimensions.get('window');
  const defaultIconProps = { size: 22 };
  const defaultSize = { height: width, width: width };

  return (
    <ImageBackground {...imageBackgroundProps} resizeMode='cover' 
      style={[defaultSize, containerStyle]}>
      <View style={styles.icons}>
        {leftIcon && <Pressable style={styles.icon} {...leftPressable}>
          <Icon {...defaultIconProps} {...leftIcon}/>
        </Pressable>}
        <View style={{flex: 1}}/>
        {rightIcon && <Pressable style={styles.icon} {...rightPressable}>
          <Icon {...defaultIconProps} {...rightIcon}/>
        </Pressable>}
      </View>
      <View style={{flexDirection: 'column', flex: 1, justifyContent: 'center'}}>
        {centerIcon && <Pressable style={styles.icon} {...centerPressable}>
          <Icon {...defaultIconProps} {...centerIcon}/>
        </Pressable>}
      </View>
      {children}
    </ImageBackground>
  );
};

export default ImageWithIconOverlay;

const styles = StyleSheet.create({
  icons: {
    flexDirection: 'row'
  },
  icon: {
    margin: 10
  },
})