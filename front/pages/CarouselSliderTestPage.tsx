import { useEffect, useState } from "react";
import { CarouselSlider, GapProps} from "../components/CarouselSlider";
import ImageWithIconOverlay from "../components/ImageWithIconOverlay";
import { Dimensions, ImageSourcePropType, StyleProp, ViewStyle } from "react-native";
import { colors } from "../assets/colors";

const CarouselSliderTestPage = () => {
  /** 
   * flag: imageSlider를 보고 싶으면 true, carousel을 보고 싶으면 false 설정
  */
  const flag = true;

  /**
   * auto: 자동으로 페이지가 넘어가는 기능을 보고 싶으면 true, 아니면 false 설정
   */
  const auto = false;

  /**
   * edit: 수정 기능을 보고 싶으면 true, 아니면 false 설정
   */
  const edit = false;

  // component의 필수 파라미터, pageWidth, offset, gap 설정
  const width = Dimensions.get('window').width;
  const [ pageWidth, setPageWidth ] = useState(width);
  const [ offset, setOffset ] = useState(0);
  const [ gap, setGap ] = useState({leftGap: 0, rightGap: 0, topGap: 0, bottomGap: 0});

  // 내부 page 설정
  const images = [
    {
      id: 0,
      type: 'image',
      source: require('../assets/images/imageTest1.png'),
    },
    {
      id: 1,
      type: 'image',
      source: require('../assets/images/imageTest1.png')
    },
    {
      id: 2,
      type: 'image',
      source: require('../assets/images/imageTest1.png')
    },
    {
      id: 3,
      type: 'image',
      source: require('../assets/images/imageTest1.png')
    },
    // {
    //   id: 4,
    //   type: 'add',
    //   source: null
    // }
  ]
  function renderItem(
    {id, type, source}: {id: number, type: string, source: ImageSourcePropType | undefined},
    containerStyle: StyleProp<ViewStyle>) {
    if (type == 'image') {
      return (
        <ImageWithIconOverlay
          source={source} borderRadius={edit?15:0} key={id}
          containerStyle={containerStyle}
          rightIcon={edit?{source: require('../assets/images/Icon.png')}:undefined} 
          rightPressable={{onPress: () => {console.log("right press")}}}
          />
      );
    } else{
      return (
        <ImageWithIconOverlay
          borderRadius={15} key={id}
          containerStyle={[containerStyle, {backgroundColor: colors.gray2}]}
          centerIcon={{size: 80, source: 'plus'}} centerPressable={{onPress: () => {}, style:{alignSelf: 'center'}}}/>
      );
    } 
  }

  useEffect(() => {
    if (flag) {
      setPageWidth(width);
      setOffset(0);
      setGap({leftGap: 0, rightGap: 0, topGap: 0, bottomGap: 0});
    } else {
      const _offset = 37;
      const _gap = 20;

      setPageWidth(width - _offset * 2 - _gap * 2);
      setOffset(_offset);
      setGap({leftGap: _gap, rightGap: _gap, topGap: 46, bottomGap: 20});
    }
  }, [flag])

  useEffect(() => {
    if (auto) {
      if (images[images.length-1].type == 'add') {
        images.pop()
      }
    } else {
      if (images[images.length-1].type != 'add') {
        images.push({id: images.length, type: 'add', source: null})
      }
    }
  }, [auto])

  return (
    <CarouselSlider
      pageWidth={pageWidth}
      pageHeight={pageWidth}
      offset={offset}
      gap={gap}
      data={images}
      autoScrollToNextPage={auto}
      renderItem={renderItem}
      />
  )
}

export default CarouselSliderTestPage;