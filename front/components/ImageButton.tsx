import { TouchableOpacity, TouchableOpacityProps, StyleSheet, StyleProp, ViewStyle, ImageStyle, ImageURISource, LayoutChangeEvent, NativeSyntheticEvent, ImageLoadEventData, ImageErrorEventData } from 'react-native';
import AutoHeightImage, { AutoHeightImageProps } from 'react-native-auto-height-image';
import { colors } from '../assets/colors';


interface Props extends TouchableOpacityProps {
  borderRadius?: number | undefined
  containerStyle?: StyleProp<ViewStyle>
  imageStyle?: StyleProp<ImageStyle>
  imageProps: AutoHeightImageProps
}

/**
 * @param borderRadius :number | undefined. 이미지, 컨테이너에 부여할 borderRadius
 * @param containerStyle :StyleProp<ViewStyle>. container에 부여할 style
 * @param imageStyle :StyleProp<ImageStyle>. image에 부여할 style
 * @param imageProps :AutoHeightImageProps. image 설정에 필요한 props
 */
const ImageButton = ({ 
  borderRadius,
  containerStyle,
  imageStyle,
  imageProps,
  ...props
} : Props) => {
  return (
    <TouchableOpacity {...props} style={[styles.defaultContainerStyle, {borderRadius: borderRadius}, containerStyle]}>
      <AutoHeightImage {...imageProps} borderRadius={borderRadius} style={imageStyle}/>
    </TouchableOpacity>
  );
}

export default ImageButton;

const styles = StyleSheet.create({
  defaultContainerStyle: {
    alignSelf: 'center',
    backgroundColor: colors.pastel_point,
    borderRadius: 10,
    marginVertical: 5
  },
});