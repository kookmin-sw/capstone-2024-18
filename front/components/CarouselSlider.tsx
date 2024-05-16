import { useEffect, useRef, useState } from "react";
import { FlatList, FlatListProps, StyleProp, ViewStyle } from "react-native";

import useInterval from "./useInterval.tsx";
import { colors } from "../assets/colors.tsx";


export interface GapProps {
  leftGap: number
  rightGap: number
  topGap: number
  bottomGap: number
}
/**
 * @param data :IconProp. 보여주는 컨텐츠의 data 전달
 * @param gap :GapProps. 현재 페이지와 다음 페이지 사이의 간격 설정하는 인자 전달. gap은 가로 세로 따로 설정 가능
 * @param offset :number. 다음 페이지가 보이는 영역 width 설정한는 인자 전달
 * @param pageWidth :number. page width 설정하는 인자 전달
 * @param pageHeight :number. page height 설정하는 인자 전달
 * @param autoScrollToNextPage: boolean. 자동으로 페이지 넘어가게 만들어주는 인자 전달
 * @param autoScrollToNextPageInterval: number. 자동으로 페이지 넘어가는 시간 Interval
 * @param onPageChange :(page: number) => void. page가 바뀔때마다 호출해야하는 함수 전달
 * @param renderItem: (item: any, containerStyle: StyleProp<ViewStyle>) => JSX.Element. 기존 FlatList의 renderItem에 style 적용을 위한 함수 전달
 */
interface Props extends Omit<FlatListProps<any>, 'renderItem'> {
  data: ArrayLike<any>
  gap: GapProps
  offset: number
  pageWidth: number
  pageHeight: number
  autoScrollToNextPage?: boolean
  autoScrollToNextPageInterval?: number
  onPageChange?: (page: number) => void
  renderItem: (item: any, containerStyle: StyleProp<ViewStyle>) => JSX.Element
}

export const CarouselSlider = (({ 
  data,
  offset,
  gap,
  pageWidth,
  pageHeight,
  autoScrollToNextPage=false,
  autoScrollToNextPageInterval=2400,
  onPageChange,
  renderItem,
  ...flatListProps
}: Props) => {
  const flatlistRef = useRef<FlatList>(null)
  const [ page, setPage ] = useState(0);

  // gap, offset, pageWidth, data가 바뀌면, 첫번째 페이지로 돌아갑니다
  useEffect(() => {
    flatlistRef.current?.scrollToOffset({offset: 0});
  }, [gap, offset, pageWidth, data])

  const onScroll = (e: any) => {
    // scroll이 움직일 때마다, page를 기록합니다
    const newPage = Math.round(
      e.nativeEvent.contentOffset.x / (pageWidth + (gap.leftGap + gap.rightGap) / 2)
    );
    setPage(newPage);
  };

  // renderItem 다시 구현
  function newRenderItem({item}: any) {
    const marginStyle = {
      width: pageWidth,
      height: pageHeight,
      marginRight: gap.rightGap,
      marginLeft: gap.leftGap,
      marginTop: gap.topGap,
      marginBottom: gap.bottomGap
    }

    return renderItem(item, marginStyle);
  }

  // page가 바뀔때마다, 사용자의 onPageChange 메소드를 실행
  useEffect(() => {
    onPageChange && onPageChange(page);
  }, [page])

  // auto scroll page 기능
  useInterval(() => {
    function getNextOffset() {
      if (page + 1 >= data.length) return 0;
      else return (page + 1) * (pageWidth + (gap.leftGap + gap.rightGap))
    }

    flatlistRef.current?.scrollToOffset({offset: getNextOffset(), animated: true});
  }, autoScrollToNextPage ? autoScrollToNextPageInterval : null);
  
  return (
    <FlatList 
      {...flatListProps}
      data={data}
      renderItem={newRenderItem}
      ref={flatlistRef}
      onScroll={onScroll}
      showsHorizontalScrollIndicator={false}
      automaticallyAdjustContentInsets={false}
      decelerationRate="fast"
      snapToAlignment="start"
      horizontal
      pagingEnabled
      snapToInterval={pageWidth + (gap.leftGap + gap.rightGap) / 2 + offset / 2}
      contentContainerStyle={{
        paddingLeft: offset,
        paddingRight: offset,
        backgroundColor: colors.white
      }}
      style={{width: pageWidth + gap.leftGap + gap.rightGap + offset * 2, alignSelf: 'center'}}
    />
  );
});

export default CarouselSlider;