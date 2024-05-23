import { useState, useContext, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Touchable } from 'react-native';

import { colors } from '../assets/colors.tsx';
import ImageWithIconOverlay from '../components/ImageWithIconOverlay.tsx';
import IconText from '../components/IconText.tsx';
import { getAnalysisInfoShort, getBasicInfo, getFaceInfo, isAnalysisShortResponse, isBasicInfoResponse, isErrorResponse, isFaceInfoResponse } from '../util/auth.tsx';
import { AuthContext } from '../store/auth-context.tsx';
import { createAlertMessage } from '../util/alert.tsx';
import { Card, Icon } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { AgeDegree, AgeGroup, Gender, HeightGroup, Region, ageDegree, ageGroup, gender, heightGroup, region } from '../util/basicInfoFormat.tsx';
import { UserContext } from '../store/user-context.tsx';
import CustomButton from '../components/CustomButton.tsx';


const Profile = ({navigation}: any) => {
  // auth와 페이지 전환을 위한 method
  const authCtx = useContext(AuthContext);
  const userCtx = useContext(UserContext);

  // 이미지 uri path
  const [ generatedS3url, setGeneratedS3url ] = useState('');
  const [ originS3url, setOriginS3url ] = useState('');

  // 기본 정보
  const [ basic, setBasic ] = useState(["DEFAULT", "DEFAULT", "DEFAULT", "DEFAULT"])
  const [ nickname, setNickName ] = useState(userCtx.basicinfo.nickname);

  const _analysis = ["DEFAULT", "DEFAULT", "DEFAULT", "DEFAULT"]
  const [ analysis, setAnalysis ] = useState(
    _analysis.map((_a) => {
      return '#' + _a;
    })
  )

  const tryGetFaceInfo = async () => {
    if (authCtx.accessToken) {
      const response = await getFaceInfo(
        authCtx.accessToken
      );
      
      if (!isFaceInfoResponse(response)) {
        createAlertMessage(response.message);
      } else {
        if (userCtx.faceinfo.generatedS3url !== response.generatedS3url) {
          userCtx.setFaceinfo({
            originS3url: response.originS3url,
            generatedS3url: response.generatedS3url
          })
        }
      }
    } else { // 실제에서는 절대 없는 예외 상황
      console.log("로그인 정보가 없습니다.");
    }
  }

  useEffect(() => {
    setNickName(userCtx.basicinfo.nickname);
    const newBasic = [ 
      gender[userCtx.basicinfo.gender as keyof Gender], 
      ageGroup[userCtx.basicinfo.ageGroup as keyof AgeGroup] + ageDegree[userCtx.basicinfo.ageDegree as keyof AgeDegree], 
      heightGroup[userCtx.basicinfo.heightGroup as keyof HeightGroup], 
      '서울 ' + region['SEOUL'][userCtx.basicinfo.region as keyof Region['SEOUL']]];
    setBasic(newBasic.map((_basic) => {
      return ('#' + _basic);
    }))
  }, [userCtx.basicinfo])

  useEffect(() => {
    setGeneratedS3url(userCtx.faceinfo.generatedS3url);
    setOriginS3url(userCtx.faceinfo.originS3url);
  }, [userCtx.faceinfo])

  useEffect(() => {
    if (userCtx.analysisinfo) {
      setAnalysis(userCtx.analysisinfo.analysisShort.map((_analysis, index) => {
        return '#' + _analysis;
      }))
    }
  }, [userCtx.analysisinfo])

  useFocusEffect(
    useCallback(() => {
      console.log("get faceinfo")
      tryGetFaceInfo();
    }, [])
  )

  const editButton = (onPress: () => void) => {
    return <Pressable onPress={onPress} style={styles.icon}><Icon source={'pencil-outline'} size={19} color={colors.point}/></Pressable>
  }

  const handleSignout = () => {
    authCtx.signout();
    userCtx.clearInfo();
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <IconText 
          icon={{source: require('../assets/images/question.png'), size: 18, color: colors.gray7}} 
          textStyle={styles.cardText}>프로필 이미지가 왜 2개인가요? 🤔</IconText>
      </Card>
      <View style={styles.textContainer}>
        <Text style={styles.text}>AI 관상은 서로 모르는 사이에서도 쉽게 다가갈 수 있기 위한 목적으로 사용해요. 만약 채팅을 통해 충분히 친해졌다면 실제 프로필 이미지를 공개할 수 있어요.</Text>
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.imageRowFlexBox}>
          <ImageWithIconOverlay
            borderRadius={300} source={{uri: originS3url}}
            containerStyle={styles.grayImageContainer} imageStyle={styles.image}
            centerIcon={{size: 80, source: 'plus', color: colors.transparent}} 
            centerPressable={{onPress: () => navigation.navigate('FaceInfo')}}/>
          <ImageWithIconOverlay
            borderRadius={300} source={{uri: generatedS3url}}
            containerStyle={styles.grayImageContainer} imageStyle={styles.image}
            centerIcon={{size: 80, source: 'plus', color: colors.transparent}} 
            centerPressable={{onPress: () => navigation.navigate('FaceInfo')}}/>
        </View>
        <View style={styles.rowFlexBox}>
          <Text style={styles.nickname}>{nickname}</Text>
          {editButton(() => {navigation.navigate('Nickname')})}
        </View>
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
          <Pressable onPress={() => {console.log("관상 정보 자세히 보기")}}>
            <Text style={styles.grayContent}>{analysis.join(' ')}</Text>
          </Pressable>
        </View>
        <CustomButton 
          containerStyle={{backgroundColor: colors.gray4, marginHorizontal: 5, elevation: 4}}
          textStyle={{color: colors.white, fontSize:18, letterSpacing: -18* 0.02, fontFamily: "Pretendard-SemiBold"}}
          onPress={handleSignout}>로그아웃</CustomButton>
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

  card: {
    backgroundColor: colors.light_pink,
    width: 248,
    height: 32,
    margin: 10, 
    justifyContent: "center",
    alignItems: "center",
    alignSelf: 'center'
  },
  cardText: {
    paddingLeft: 5, 
    fontFamily: "Pretendard-Medium",
    fontSize: 14,
    letterSpacing: -14 * 0.02,
  },

  nickname: {
    fontFamily: 'Pretendard-Semibold',
    color: '#525463',
    fontSize: 20,
    paddingLeft: 6, 
    paddingVertical: 16,
    fontWeight: '600'
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
    marginVertical: 12,
    marginBottom: 17,
  },
  text: {
    fontSize: 14,
    letterSpacing: -14* 0.04,
    textAlign: "center",
    color: colors.gray7,
    fontFamily: "Pretendard-Regular",
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
    fontFamily: 'Pretendard-SemiBold', 
    fontSize: 14,
    color: colors.gray7
  },
  grayContent: {
    fontFamily: 'Pretendard-Medium',
    paddingTop: 5,
    fontSize: 14,
    letterSpacing: -14* 0.02,
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