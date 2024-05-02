import { useState, useContext, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';

import { colors } from '../assets/colors.tsx';
import ImageWithIconOverlay from '../components/ImageWithIconOverlay.tsx';
import IconText from '../components/IconText.tsx';
import { getAnalysisInfoShort, getBasicInfo, getFaceInfo, isAnalysisShortInfoResponse, isBasicInfoResponse, isErrorResponse, isFaceInfoResponse } from '../util/auth.tsx';
import { AuthContext } from '../store/auth-context.tsx';
import { createAlertMessage } from '../util/alert.tsx';
import { Icon } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { AgeDegree, AgeGroup, Gender, HeightGroup, Region, ageDegree, ageGroup, gender, heightGroup, region } from '../util/basicInfoFormat.tsx';


const Profile = ({navigation}: any) => {
  // auth와 페이지 전환을 위한 method
  const authCtx = useContext(AuthContext);

  // 이미지 uri path
  const [ generatedS3Url, setGeneratedS3Url ] = useState('');
  const [ haveGeneratedS3Url, setHaveGeneratedS3Url ] = useState(false);
  const [ originS3Url, setOriginS3Url ] = useState('');

  const tryGetFaceInfo = async () => {
    if (authCtx.accessToken) {
      const response = await getFaceInfo(
        authCtx.accessToken
      );
      
      if (!isFaceInfoResponse(response)) {
        createAlertMessage(response.message);
      } else {
        setGeneratedS3Url(response.generatedS3Url);
        setHaveGeneratedS3Url(true);
        setOriginS3Url(response.originS3Url);
      }
    } else { // 실제에서는 절대 없는 예외 상황
      console.log("로그인 정보가 없습니다.");
    }
  }

  // 기본 정보
  const [ basic, setBasic ] = useState(["DEFAULT", "DEFAULT", "DEFAULT", "DEFAULT"])
  const [ nickname, setNickName ] = useState('');

  const createBasicInfo = async () => {
    if (authCtx.accessToken) {
      const response = await getBasicInfo(
        authCtx.accessToken
      );  
      if (isBasicInfoResponse(response)) {
        setNickName(response.nickname);
        const newBasic = [ 
          gender[response.gender as keyof Gender], 
          ageGroup[response.ageGroup as keyof AgeGroup] + ageDegree[response.ageDegree as keyof AgeDegree], 
          heightGroup[response.heightGroup as keyof HeightGroup], 
          '서울 ' + region['SEOUL'][response.region as keyof Region['SEOUL']]];
        setBasic(newBasic.map((_basic) => {
          return ('#' + _basic);
        }))
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

  const _analysis = ["DEFAULT", "DEFAULT", "DEFAULT", "DEFAULT"]
  const [ analysis, setAnalysis ] = useState(
    _analysis.map((_a) => {
      return '#' + _a;
    })
  )

  const createAnalysisInfo = async () => {
    if (authCtx.accessToken) {
      const response = await getAnalysisInfoShort(
        authCtx.accessToken
      );  
      if (isAnalysisShortInfoResponse(response)) {
        setAnalysis(response.analysisShort.map((_analysis, index) => {
          return '#' + _analysis;
        }))
      }
      if (isErrorResponse(response)) {
        createAlertMessage(response.message);
      }
    }
    else {
      console.log("로그인 정보가 없습니다.");
    }
  }

  useFocusEffect(
    useCallback(() => {
      createBasicInfo();
      tryGetFaceInfo();
      createAnalysisInfo();
    }, [])
  );

  const editButton = (onPress: () => void) => {
    return <Pressable onPress={onPress} style={styles.icon}><Icon source={'pencil-outline'} size={19} color={colors.point}/></Pressable>
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <IconText 
        icon={{source: 'chat-question', color: colors.gray7}} 
        containerStyle={styles.hintContainer}
        textStyle={{fontSize: 14, color: colors.gray7}}>AI 관상 분석은 무엇인가요? 🤔</IconText>
      <View style={styles.textContainer}>
        <Text style={styles.text}>AI 관상은 서로 모르는 사이에서도 쉽게 다가갈 수 있기 위한 목적으로 사용해요. 만약 채팅을 통해 충분히 친해졌다면 실제 프로필 이미지를 공개할 수 있어요.</Text>
      </View>
      <View style={styles.contentContainer}>
        {haveGeneratedS3Url ? 
        <View style={styles.imageRowFlexBox}>
          <ImageWithIconOverlay
            borderRadius={300} source={{uri: generatedS3Url}}
            containerStyle={styles.grayImageContainer} imageStyle={styles.image}
            centerIcon={{size: 80, source: 'plus', color: colors.transparent}} 
            centerPressable={{onPress: () => navigation.navigate('FaceInfo')}}/>
          <ImageWithIconOverlay
            borderRadius={300} source={{uri: originS3Url}}
            containerStyle={styles.grayImageContainer} imageStyle={styles.image}
            centerIcon={{size: 80, source: 'plus', color: colors.transparent}} 
            centerPressable={{onPress: () => navigation.navigate('FaceInfo')}}/>
        </View>:<></>
        }
        <View style={styles.rowFlexBox}>
          <Text style={styles.nickname}>{nickname}</Text>
          {editButton(() => {navigation.navigate('Nickname')})}
        </View>
        {/* 이 부분 코드는 나중에 관상 분석 결과 내용 나오면 수정 */}
        <View style={styles.grayContainer}>
          <View style={styles.rowFlexBox}>
            <Text style={styles.grayTitle}>기본 정보</Text>
            {editButton(() => {navigation.navigate('BasicInfoWithoutNickname')})}
          </View>
          <Text style={styles.grayContent}>{basic.join(' ')}</Text>
        </View>
        <View style={styles.grayContainer}>
          <View style={styles.rowFlexBox}>
            <Text style={styles.grayTitle}>관상 정보</Text>
            {editButton(() => {navigation.navigate('FaceFeature')})}
          </View>
          <Text style={styles.grayContent}>{analysis.join(' ')}</Text>
        </View>
      </View>
      <View style={{flex: 1}}/>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 30,
    minHeight: '100%',
    justifyContent: 'center',
    backgroundColor: colors.white
  },
  contentContainer: {
    justifyContent: 'center',
    paddingBottom: 15
  },

  nickname: {
    color: '#525463',
    fontSize: 20,
    paddingLeft: 6, 
    paddingVertical: 16,
  },

  icon: {
    alignSelf:'center', 
    marginHorizontal: 10
  },

  imageRowFlexBox: {
    flexDirection: 'row', 
    alignSelf: 'center'
  },

  rowFlexBox: {
    flexDirection: 'row', 
  },

  // 이번 창의 단어 hint (ex. ai 관상은 무엇인가요?)
  hintContainer: {
    backgroundColor: colors.light_pink, 
    height: 32, 
    paddingHorizontal: 16,
    borderRadius: 15, 
    alignSelf: 'center',
    marginVertical: 17
  },

  textContainer: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 17, 
    backgroundColor: colors.gray1,
    borderWidth: 1,
    borderColor: colors.gray2,
    borderRadius: 10
  },
  text: {
    fontSize: 14,
    letterSpacing: -14* 0.04,
    textAlign: "center",
    color: colors.gray7,
    fontFamily: "Pretendard-Regualar",
  },

  // 회색 tip, gray 상자
  grayContainer: {
    backgroundColor: colors.gray1, 
    paddingTop: 15,
    paddingBottom: 17,
    paddingHorizontal: 18,
    flex: 1, 
    marginBottom: 17,
    borderRadius: 10
  },

  // 회색 상자의 text style
  grayTitle: {
    fontSize: 16,
    color: colors.gray7
  },
  grayContent: {
    paddingTop: 5,
    fontSize: 14,
    color: colors.gray7,
  },

  // 이미지 설정 style
  image: {
    width: 121, 
    height: 121, 
  },
  grayImageContainer: {
    width: 125, 
    height: 125, 
    alignSelf: 'center', 
    borderRadius: 300, 
    borderWidth: 2,
    borderColor: colors.point,
    backgroundColor: colors.point,
    marginHorizontal: 8,
    marginBottom: 27
  },
});

export default Profile;