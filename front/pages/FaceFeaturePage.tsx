import { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, SafeAreaView, useWindowDimensions } from 'react-native';
import CustomButton from '../components/CustomButton.tsx';

import { colors } from '../assets/colors.tsx';
import ImageWithIconOverlay from '../components/ImageWithIconOverlay.tsx';
import { showModal } from '../components/CameraComponent.tsx';
import IconText from '../components/IconText.tsx';
import { getAnalysisInfo, getFaceInfo, isAnalysisFullResponse, isAnalysisInfoResponse, isErrorResponse, isFaceInfoDefaultResponse, isFaceInfoResponse, putAnalysisInfo } from '../util/auth.tsx';
import { AuthContext } from '../store/auth-context.tsx';
import { Card, IconButton } from 'react-native-paper';
import CustomBackHandler from '../components/CustomBackHandler.tsx';
import { UserContext } from '../store/user-context.tsx';
import HeaderBar from '../components/HeaderBar.tsx';
import { AlertContext } from '../store/alert-context.tsx';

const FaceFeaturePage = ({navigation}: any) => {
  // auth와 페이지 전환을 위한 method
  const authCtx = useContext(AuthContext);
  const userCtx = useContext(UserContext);
  const { createAlertMessage } = useContext(AlertContext);

  const {height} = useWindowDimensions();

  // 이미지 uri path
  const [ uri, setUri ] = useState('');
  const [ generatedS3url, setGeneratedS3url ] = useState('');
  const [ havegeneratedS3url, setHaveGeneratedS3url ] = useState(false);

  const [ isImageSetting, setIsImageSetting ] = useState(false);
  const [ isButtonClickable, setIsButtonClickable ] = useState(false);

  const [ pageIndex, setPageIndex ] = useState(0);

  // 이미지 추가하는 방식 모달 가시성 설정
  const [ modalVisible, setModalVisible ] = useState(false);

  // 얼굴 분석
  const [results, setResults] = useState<Record<string, string>>({});

  function setPhoto(uri: string) {
    setUri(uri);
    console.log(uri);
    setIsImageSetting(true);
  }

  // 이미지 추가하는 방식(사진 찍기, 갤러리에서 사진 가져오기) 모달 보여주기
  function takePhoto() {
    setModalVisible(true);
  }

  const tryGetFaceInfo = async () => {
    if (authCtx.accessToken) {
      const response = await getFaceInfo(
        authCtx.accessToken
      );
      
      if (isErrorResponse(response)) {
        createAlertMessage(response.exceptionCode + response.message);
      }
      if (isFaceInfoDefaultResponse(response)) {
        setHaveGeneratedS3url(false);
      } else if (isFaceInfoResponse(response)) {
        setGeneratedS3url(response.generatedS3url);
        setHaveGeneratedS3url(true);
      }
    } else { // 실제에서는 절대 없는 예외 상황
      console.log("로그인 정보가 없습니다.");
    }
  }

  const tryPostFaceFeature = async () => {
    if (authCtx.accessToken) {
      const analysisResponse = await putAnalysisInfo(
        authCtx.accessToken, uri
      );
      
      if (isAnalysisInfoResponse(analysisResponse)) {
        setResults(analysisResponse.analysisFull);
        userCtx.setAnalysisinfo(analysisResponse);
        setPageIndex(1);
      } else {
        createAlertMessage(analysisResponse.message);
      }
    } else { // 실제에서는 절대 없는 예외 상황
      console.log("로그인 정보가 없습니다.");
    }
  }

  const clickButton = async () => {
    if (pageIndex === contents.length - 1) {
      // 메인 페이지로 이동
      createAlertMessage("관상 분석 내용은 프로필에서 다시 볼 수 있습니다.", () => {
        userCtx.setStatus('FACE_FEATURE_EXIST');
        navigation.goBack();
      })
    } else {
      // ai 관상 이미지 생성
      createAlertMessage("해당 이미지로 AI 관상 이미지를 생성할까요?", tryPostFaceFeature)
    }
  }

  const setImageContent = (
    <View style={styles.contentContainer}>
      {showModal(modalVisible, () => {setModalVisible(false)}, setPhoto )}
      <ImageWithIconOverlay
        borderRadius={300} source={{uri: uri}}
        containerStyle={[styles.imageContainer, !isImageSetting ? styles.unsettingImageColor : styles.settingImageColor]}
        imageStyle={styles.image}
        centerIcon={{size: 80, source: 'plus', color: !isImageSetting ? colors.pastel_point : colors.transparent}} 
        centerPressable={{onPress: () => takePhoto(), style:{alignSelf: 'center'}}}>
        {!isImageSetting ? <Text style={styles.imageText}>필수</Text> : undefined}
      </ImageWithIconOverlay>
      <View style={styles.grayContainer}>
        <Text style={styles.tipTitle}>관상 분석 팁</Text>
        <View style={{flexDirection:'row', alignSelf: 'center', paddingBottom: 12.5}} >
          <ImageWithIconOverlay containerStyle={styles.tipImage} source={require('../assets/images/face_feature_hint1.png')}>
            <IconButton icon={'circle-outline'} size={23} iconColor={colors.white} style={styles.bottomIcon}/>
          </ImageWithIconOverlay>
          <ImageWithIconOverlay containerStyle={styles.tipImage} source={require('../assets/images/face_feature_hint2.png')}>
            <IconButton icon={'close'} size={23} iconColor={colors.white} style={styles.bottomIcon}/>
          </ImageWithIconOverlay>
        </View>
        <Text style={styles.tipText}>단체사진이 아닌 눈,코,입 눈썹 등 얼굴 요소가 잘 드러난 독사진이어야 해요.</Text>
      </View>
    </View>
  );
  const resultContent = (
    <View style={styles.contentContainer}>
      {havegeneratedS3url ? 
      <ImageWithIconOverlay
        borderRadius={300} source={{uri: generatedS3url}}
        containerStyle={styles.resultImageContainer} imageStyle={styles.image}>
        <IconButton icon={'check'} size={30} iconColor={colors.white} style={styles.resultBottomIcon}/>
      </ImageWithIconOverlay>:<></>
      }
      {/* 이 부분 코드는 나중에 관상 분석 결과 내용 나오면 수정 */}
      <View style={styles.resultContainer}>
        {
          Object.entries(results).map(([key, value]) => (
            <View key={key}>
              <Text style={styles.resultTitle}>{key}</Text>
              <Text style={styles.resultContent}>{value}</Text>
            </View>
          ))
        }
      </View>
    </View>
  );

  useEffect(() => {
    if (!isImageSetting) return;
    setIsButtonClickable(true);
  }, [isImageSetting])

  useEffect(() => {
    if (pageIndex === 1) {
      tryGetFaceInfo()
    }
  }, [pageIndex])

  const contents = [
    setImageContent,
    resultContent
  ];

  const handleBack = () => {
    if (pageIndex === 0) {
      navigation.goBack();
    }
    else {
      setPageIndex(0);
    }
  }

  return (
    <SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{minHeight: height}}>
        <CustomBackHandler onBack={navigation.goBack}/>
        <HeaderBar onPress={handleBack}>AI 관상 분석</HeaderBar>
        <View style={styles.container}>
          <Card style={styles.card}>
            <IconText 
              icon={{source: require('../assets/images/question.png'), size: 18, color: colors.gray7}} 
              textStyle={styles.cardText}>AI 관상 분석은 무엇인가요? 🤔</IconText>
          </Card>
          <View style={styles.textContainer}>
            <Text style={styles.text}>FACE FRIEND 에서는 실제 얼굴을 드러내지 않는 반익명 활동을 장려해요. 때문에 학습시킨 AI로 관상 분석 후, 관상학적으로 잘 맞는 유저를 추천해드려요</Text>
          </View>
          {contents[pageIndex]}
          <View style={styles.bottomContainer}>
            <CustomButton 
              containerStyle={[{elevation: 4}, isButtonClickable ? {backgroundColor: colors.point} : {backgroundColor: colors.pastel_point}]} 
              onPress={clickButton}
              textStyle={{color: colors.white}} disabled={!isButtonClickable}
              >{pageIndex === contents.length - 1 ? "완료" : "다음"}</CustomButton>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white", 
    flex: 1, 
    paddingHorizontal: 32, 
  },
  contentContainer: {
    justifyContent: 'center',
    paddingBottom: 15
  },

  card: {
    backgroundColor: colors.light_pink,
    width: 225,
    height: 32,
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

  // 이번 창의 단어 hint (ex. ai 관상은 무엇인가요?)
  hintContainer: {
    backgroundColor: colors.light_pink, 
    height: 32, 
    paddingHorizontal: 16,
    borderRadius: 15, 
    alignSelf: 'center',
    marginBottom: 17
  },

  // 회색 tip, result 상자
  grayContainer: {
    backgroundColor: colors.gray1, 
    padding: 11,
    marginTop: 40, 
    marginBottom: 18
  },
  resultContainer: {
    backgroundColor: colors.gray1, 
    padding: 22,
    flex: 1, 
    marginBottom: 18,
    borderRadius: 10
  },

  // 결과 회색 상자의 text style
  resultTitle: {
    fontFamily: "Pretendard-Semibold",
    paddingTop: 12,
    fontSize: 16,
    letterSpacing: -16* 0.02,
    color: colors.point
  },
  resultContent: {
    fontFamily: "Pretendard-Regular",
    paddingTop: 5,
    fontSize: 14,
    letterSpacing: -14* 0.04,
    color: colors.gray7
  },

  // tip 회색 상자의 text style
  tipTitle: {
    width: '100%', 
    fontFamily: "Pretendard-Medium",
    fontSize: 16, 
    letterSpacing: -16 * 0.02,
    color: colors.gray7, 
    padding: 11, 
    borderBottomWidth: 1, 
    borderBottomColor: colors.gray4,
    textAlign: 'center'
  },
  tipText: {
    fontSize: 14,
    fontFamily: "Pretendard-Regular",
    letterSpacing: -14* 0.02,
    color: colors.gray6,
    paddingHorizontal: 3,
    textAlign: 'center',
    margin: 4
  },

  // tip 안에 있는 image style
  tipImage: {
    width: 80,
    height: 80, 
    margin: 10
  },
  // tip 안에 있는 image의 bottom icon style
  bottomIcon: {
    backgroundColor: colors.gray5, 
    borderWidth: 1, 
    borderColor: colors.white,
    position: 'absolute', 
    bottom: -22.5, 
    left: 12.5
  },

  // 이미지 color style
  settingImageColor: {
    backgroundColor: '#626262',
    borderColor: '#626262'
  },
  unsettingImageColor: {
    backgroundColor: colors.light_pink, 
    borderColor: colors.pastel_point
  },

  // 이미지 설정 style
  image: {
    width: 226, 
    height: 226, 
  },
  imageContainer: {
    width: 230, 
    height: 230, 
    alignSelf: 'center', 
    borderRadius: 300, 
    borderWidth: 2,
    borderColor: '#626262',
    backgroundColor: colors.light_pink,
    paddingTop: 33 // plus 중앙 배열을 위한 imageText 만큼의 크기 paddingTop으로 설정
  },
  resultImageContainer: {
    width: 230, 
    height: 230, 
    alignSelf: 'center', 
    borderRadius: 300, 
    borderWidth: 2,
    borderColor: colors.point,
    backgroundColor: colors.point,
    marginBottom: 27
  },
  // 이미지의 '필수' 텍스트 style
  imageText: { 
    fontFamily: "Pretendard-Medium",
    alignSelf: 'center', 
    height: 18, 
    marginBottom: 15, 
    fontSize: 12,
    letterSpacing: -12 * 0.02,
    color: colors.point
  },
  // result창의 이미지 style
  resultBottomIcon: {
    backgroundColor: colors.point, 
    borderWidth: 1, 
    borderColor: colors.point,
    position: 'absolute', 
    bottom: -30, 
    left: 85,
  },

  // bottom button container
  bottomContainer: {
    alignItems: "center",
    marginBottom: 46,
    paddingHorizontal: 8,
  },
});

export default FaceFeaturePage;