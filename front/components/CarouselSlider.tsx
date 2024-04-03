import { useEffect, useRef, useState } from "react";
import { FlatList, FlatListProps } from "react-native";

import useInterval from "./useInterval.tsx";


/**
 * @param data :IconProp. 보여주는 컨텐츠의 data 전달
 * @param gap :number. 현재 페이지와 다음 페이지 사이의 간격 설정하는 인자 전달
 * @param offset :number. 다음 페이지가 보이는 영역 width 설정한는 인자 전달
 * @param pageWidth :number. page width 설정하는 인자 전달
 * @param autoScrollToNextPage: boolean. 자동으로 페이지 넘어가게 만들어주는 인자 전달
 * @param autoScrollToNextPageInterval: number. 자동으로 페이지 넘어가는 시간 Interval
 * @param onPageChange :(page: number) => void. page가 바뀔때마다 호출해야하는 함수 전달
 */
interface Props extends FlatListProps<any> {
  data: ArrayLike<any>
  gap: number
  offset: number
  pageWidth: number
  autoScrollToNextPage?: boolean
  autoScrollToNextPageInterval?: number
  onPageChange?: (page: number) => void
}

const CarouselSlider = (({ 
  data,
  offset,
  gap,
  pageWidth,
  autoScrollToNextPage=false,
  autoScrollToNextPageInterval=2400,
  onPageChange,
  ...flatListProps
}: Props) => {
  const flatlistRef = useRef<FlatList>(null)
  const [ page, setPage ] = useState(0);

  // gap, offset, pageWidth가 바뀌면, 첫번째 페이지로 돌아갑니다
  useEffect(() => {
    flatlistRef.current?.scrollToOffset({offset: 0});
  }, [gap, offset, pageWidth])

  const onScroll = (e: any) => {
    // scroll이 움직일 때마다, page를 기록합니다
    const newPage = Math.round(
      e.nativeEvent.contentOffset.x / (pageWidth + gap),
    );
    setPage(newPage);
  };

  // page가 바뀔때마다, 사용자의 onPageChange 메소드를 실행
  useEffect(() => {
    onPageChange && onPageChange(page);
  }, [page])

  // auto scroll page 기능
  useInterval(() => {
    function getNextPage() {
      if (page + 1 >= data.length)return 0;
      else return page + 1;
    }

    flatlistRef.current?.scrollToIndex({index: getNextPage(), animated: true});
  }, autoScrollToNextPage ? autoScrollToNextPageInterval : null);
  
  return (
    <FlatList 
      {...flatListProps}
      data={data}
      ref={flatlistRef}
      onScroll={onScroll}
      showsHorizontalScrollIndicator={false}
      automaticallyAdjustContentInsets={false}
      decelerationRate="fast"
      snapToAlignment="start"
      horizontal
      pagingEnabled
      snapToInterval={pageWidth + gap}
      contentContainerStyle={{
        paddingHorizontal: offset + gap / 2,
      }}
    />
  );
});

export default CarouselSlider;