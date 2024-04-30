import { View, Text, ScrollView, StyleSheet, Dimensions, Alert, StyleProp, ViewStyle, Image, TouchableOpacity } from 'react-native';
import { colors } from '../assets/colors.tsx'
import React, { useContext, useEffect, useState } from 'react';
import ImageWithIconOverlay from '../components/ImageWithIconOverlay.tsx';
import CarouselSlider from '../components/CarouselSlider.tsx';
import SelectableTag from '../components/SelectableTag.tsx';

import { getBasicInfo, getFaceInfo, isBasicInfoResponse, isErrorResponse, isFaceInfoResponse } from '../util/auth.tsx';
import { AuthContext } from "../store/auth-context.tsx";

// 이미지들의 고유 key를 임시로 주기 위한 라이브러리
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { createAlertMessage } from '../util/alert.tsx';


const Friends = () => {
  // auth를 위한 method
  const authCtx = useContext(AuthContext);

  const [exImageUrl, setExImageUrl] = useState('https://facefriend-s3-bucket.s3.ap-northeast-2.amazonaws.com/default-profile.png');
  const [nickname, setNickname] = useState('');

  // CarouselSlider의 필수 파라미터, pageWidth, offset, gap 설정
  const pageWidth = Dimensions.get('window').width;
  const offset = 0;
  const [ gap, setGap ] = useState({leftGap: 0, rightGap: 0, topGap: 0, bottomGap: 0});

  // 현재 이미지 슬라이더의 페이지를 알기 위한 페이지 설정
  const [ page, setPage ] = useState(0);

  // 이미지 슬라이더의 내부 contents 설정
  const [ images, setImages ] = useState([
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
  ]);

  /**
   * 이미지 슬라이더에 들어갈 컨텐츠 내용물 데이터를 React.ReactNode로 바꿔주는 함수
   * @param param0 :any
   * @param containerStyle :이미지 슬라이더가 gap, offset 등을 설정할 수 있게, style을 파라미터로 받아서, 알맞은 ReactNode에 적용
   * @returns React.ReactNode
   */
  function renderItem({id, type, source}: any,
    containerStyle: StyleProp<ViewStyle>) {
      return (
        <ImageWithIconOverlay
          source={source} borderRadius={0} key={id}
          containerStyle={containerStyle}/>
      );
  }

  const tryGetBasicInfo = async () => {
    if (authCtx.accessToken) {
      const response = await getBasicInfo(
        authCtx.accessToken
      );  
      if (isBasicInfoResponse(response)) {
        setNickname(response.nickname)
      } else {
        // 기본 정보 없는 경우
      }
      if (isErrorResponse(response)) {
        createAlertMessage(response.message);
      }
    }
    else {
      console.log("로그인 정보가 없습니다.");
    }
  }

  // 슬라이더의 1, 2 페이지에 관상 이미지 가져와서 display (사용자 변경 불가)
  const createFaceImage = async () => {
    if (authCtx.accessToken) {
      const response = await getFaceInfo(
        authCtx.accessToken
      );  
      if (isFaceInfoResponse(response)) {
        setExImageUrl(response.generatedS3Url);
      }
      if (isErrorResponse(response)) {
        createAlertMessage(response.message);
      }
    }
    else {
      console.log("로그인 정보가 없습니다.");
    }
  }

  useEffect(() => {
    tryGetBasicInfo();
    createFaceImage();
  }, [])

  const cardView = ({imageUrl, id}: any) =>
    <TouchableOpacity key={id} style={{marginHorizontal: 10, borderWidth: 1, borderRadius: 6}} onPress={() => console.log(id)}>
      <Image source={{uri: imageUrl}} width={150} height={150}/>
    </TouchableOpacity>;

  const defaultImageUrl = [exImageUrl, exImageUrl, exImageUrl, exImageUrl, exImageUrl, exImageUrl, exImageUrl, exImageUrl, exImageUrl, exImageUrl];
  const testCardViews = defaultImageUrl.map((url, id) => {{
    return cardView({imageUrl: url, id: uuidv4()});
  }})

  const categoriesText = [["음식", "맛집 탐방 같이 하실 분"], ["운동", "헬스 함께 해요"], ["영화", "듄 함께 보실 분~"], ["자유", "수다 떠실 분"], ["연애", "고민 상담 해주세요"], ["음악", "음악 추천 드립니다"], ["공부", "같이 카공하실 분"]];

  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false} style={{backgroundColor: "#F5F5F5"}}>
        {/* 이미지 슬라이더 */}
        <CarouselSlider
          pageWidth={pageWidth}
          pageHeight={pageWidth}
          offset={offset}
          gap={gap}
          data={images}
          onPageChange={setPage}
          renderItem={renderItem}/>

        <View style={{flexDirection: 'row', alignSelf: 'center', paddingTop: 10}}>
        {
          images.map((item, idx) => {
            return (
              <View 
                key={idx}
                style={{marginHorizontal: 4, width: 8, height: 8, borderRadius: 50,
                backgroundColor: (idx == page) ? colors.pastel_point : colors.gray2}}/>
            );
          })
        }
        </View>
        <View style={styles.personalRecommendTop}>
          <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>나와 잘 맞는 관상</Text>
            <View style={{flex: 1}}/>
            <TouchableOpacity>
              <Text>전체 보러가기{">"}</Text>
            </TouchableOpacity>
          </View>
          <Text style={{paddingLeft: 27}}>AI가 분석한 {nickname}님의 베스트 매치 관상 추천</Text>
        </View>
        <ScrollView horizontal contentContainerStyle={{paddingVertical: 26, paddingHorizontal: 16}}>
          { testCardViews }
        </ScrollView>
        <View style={styles.personalRecommendTop}>
          <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>나와 다른 관상</Text>
            <View style={{flex: 1}}/>
            <TouchableOpacity>
              <Text>전체 보러가기{">"}</Text>
            </TouchableOpacity>
          </View>
          <Text style={{marginHorizontal: 26}}>AI가 분석한 {nickname}님의 다른 관상 추천</Text>
        </View>
        <ScrollView horizontal contentContainerStyle={{paddingVertical: 26, paddingHorizontal: 16}}>
          { testCardViews }
        </ScrollView>
        <View style={{backgroundColor: '#F9F9FF', paddingTop: 20}}>
          <Text style={styles.categorySectionTitle}>카테고리별 맞춤 추전</Text>
          {
            categoriesText.map(([tag, text], idx) => {
              return (
                <View key={idx}>
                  <View style={{marginHorizontal: 26, flexDirection: 'row', alignItems: 'center'}}>
                    <SelectableTag height={27} textStyle={{fontSize: 16, color: colors.white}} containerStyle={{backgroundColor: colors.point, borderColor: colors.point}}>{tag}</SelectableTag>
                    <Text style={{paddingLeft: 8}}>{text}</Text>
                    <View style={{flex: 1}}/>
                    <TouchableOpacity>
                      <Text>전체 보러가기{">"}</Text>
                    </TouchableOpacity>
                  </View>
                  <ScrollView horizontal contentContainerStyle={{paddingVertical: 26, paddingHorizontal: 16}}>
                    { testCardViews }
                  </ScrollView>
                </View>
              );
            })
          }
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: "6%",
    flex: 1,
  },
  profileName: {
    marginLeft: 15, 
    fontSize: 15, 
    color: '#000000', 
    alignSelf: 'center'
  },

  sectionTitle: {
    fontSize: 20,
    color: colors.point
  },
  sectionTitleContainer: {
    marginHorizontal: 26, 
    marginBottom: 8, 
    flexDirection: 'row'
  },
  categorySectionTitle: {
    paddingLeft: 27,
    paddingBottom: 18, 
    fontSize: 20, 
    color: colors.point
  },
  personalRecommendTop: {
    borderBottomWidth: 1, 
    marginTop: 38, 
    paddingBottom: 11, 
    borderColor: colors.gray3
  },
});

export default Friends;