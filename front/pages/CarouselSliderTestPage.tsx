import { useEffect, useState } from "react";
import CarouselSlider from "../components/CarouselSlider";
import ImageWithIconOverlay from "../components/ImageWithIconOverlay";
import { Dimensions } from "react-native";
import { colors } from "../assets/colors";

const CarouselSliderTestPage = () => {
  /** 
   * flag: imageSlider를 보고 싶으면 true, carousel을 보고 싶으면 false 설정
  */
  const flag = true;

  /**
   * auto: 자동으로 페이지가 넘어가는 기능을 보고 싶으면 true, 아니면 false 설정
   */
  const auto = true;

  // component의 필수 파라미터, pageWidth, offset, gap 설정
  const { width } = Dimensions.get('window');
  const [ pageWidth, setPageWidth ] = useState(width);
  const [ offset, setOffset ] = useState(0);
  const [ gap, setGap ] = useState(0.0);

  useEffect(() => {
    if (flag) {
      setPageWidth(width);
      setOffset(0);
      setGap(0);
    } else {
      setPageWidth(width*0.6);
      setOffset(Math.round((width - width*0.6) / 4));
      setGap(Math.round((width - width*0.6) / 4));
    }
  }, [flag])

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
    {
      id: 4,
      type: 'add',
      source: null
    }
  ]
  function renderItem({item}: any) {
    const defaultContainerStyle = {
      width: pageWidth, 
      height: pageWidth, 
      marginHorizontal: gap / 2, 
      marginTop: gap
    };

    if (item.type == 'image') {
      return (
        <ImageWithIconOverlay
          source={item.source} borderRadius={15} key={item.id}
          containerStyle={defaultContainerStyle}
          rightIcon={{source: require('../assets/images/Icon.png')}} 
          rightPressable={{onPress: () => {console.log("right press")}}}
          />
      );
    } else{
      return (
        <ImageWithIconOverlay
          borderRadius={15} key={item.id}
          containerStyle={[defaultContainerStyle, {backgroundColor: colors.gray2}]}
          centerIcon={{size: 80, source: 'plus'}} centerPressable={{onPress: () => {}, style:{alignSelf: 'center'}}}/>
      );
    } 
  }

  return (
    <CarouselSlider
      pageWidth={pageWidth}
      offset={offset}
      gap={gap}
      data={images}
      autoScrollToNextPage={auto}
      renderItem={renderItem}
      />
  )
}

export default CarouselSliderTestPage;