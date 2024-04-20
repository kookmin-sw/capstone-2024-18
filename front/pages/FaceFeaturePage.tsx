import { useRef, useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput as RNTextInput, TouchableOpacity, ScrollView, Image, Pressable, Alert } from 'react-native';
import CustomButton from '../components/CustomButton.tsx';

import { colors } from '../assets/colors.tsx';
import ImageWithIconOverlay from '../components/ImageWithIconOverlay.tsx';
import { showModal } from '../components/CameraComponent.tsx';
import IconText from '../components/IconText.tsx';
import { getFaceInfo, isFaceInfoDefaultResponse, isFaceInfoResponse } from '../util/auth.tsx';
import { AuthContext } from '../store/auth-context.tsx';
import { createAlertMessage } from '../util/alert.tsx';
import { IconButton } from 'react-native-paper';
import { useNavigate } from 'react-router-native';

const FaceFeaturePage = () => {
  // auth와 페이지 전환을 위한 method
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  // 이미지 uri path
  const [ uri, setUri ] = useState('');
  const [ generatedS3Url, setGeneratedS3Url ] = useState('');
  const [ haveGeneratedS3Url, setHaveGeneratedS3Url ] = useState(false);

  const [ isImageSetting, setIsImageSetting ] = useState(false);
  const [ isButtonClickable, setIsButtonClickable ] = useState(false);

  const [ pageIndex, setPageIndex ] = useState(0);

  // 이미지 추가하는 방식 모달 가시성 설정
  const [ modalVisible, setModalVisible ] = useState(false);

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
      
      if (!isFaceInfoResponse(response)) {
        createAlertMessage(response.message);
      } else if (isFaceInfoDefaultResponse(response)) {
        setGeneratedS3Url(response.generatedS3Url);
        setHaveGeneratedS3Url(true);
      } else {
        setHaveGeneratedS3Url(false);
      }
    } else { // 실제에서는 절대 없는 예외 상황
      console.log("로그인 정보가 없습니다.");
    }
  }

  const tryPostFaceFeature = async () => {
    // 아직 관상 분석 메소드 없음. postFaceFeature?
    if (authCtx.accessToken) {
      // const response = await getFaceInfo(
      //   authCtx.accessToken
      // );
      
      // if (!isFaceInfoResponse(response)) {
      //   createAlertMessage(response.message);
      // } else if (isFaceInfoDefaultResponse(response)) {
      //   setGeneratedS3Url(response.generatedS3Url);
      //   setHaveGeneratedS3Url(true);
      // } else {
      //   setHaveGeneratedS3Url(false);
      // }

      // 임시로 그냥 넘어감
      setPageIndex(1)
    } else { // 실제에서는 절대 없는 예외 상황
      console.log("로그인 정보가 없습니다.");
    }
  }

  const clickButton = async () => {
    if (pageIndex === contents.length - 1) {
      // 메인 페이지로 이동
      createAlertMessage("관상 분석 내용은 프로필에서 다시 볼 수 있습니다", () => navigate('/main'))
    } else {
      // ai 관상 이미지 생성
      
      Alert.alert(
        "알림",
        "해당 이미지로 AI 관상 이미지를 생성할까요?",
        [
          { text: "확인", style: "default", onPress: () => tryPostFaceFeature()},
          { text: "취소", style: "cancel"},
        ],
        { cancelable: true },
      );
    }
  }

  const setImageContent = (
    <View style={styles.content_container}>
      {showModal(modalVisible, () => {setModalVisible(false)}, setPhoto )}
      <ImageWithIconOverlay
        borderRadius={300} source={{uri: uri}}
        containerStyle={[styles.image_container, !isImageSetting ? styles.unsetting_image_color : styles.setting_image_color]}
        imageStyle={styles.image}
        centerIcon={{size: 80, source: 'plus', color: !isImageSetting ? colors.pastel_point : colors.transparent}} 
        centerPressable={{onPress: () => takePhoto(), style:{alignSelf: 'center'}}}>
        {!isImageSetting ? <Text style={styles.image_text}>필수</Text> : undefined}
      </ImageWithIconOverlay>
      <View style={styles.gray_container}>
        <Text style={styles.tip_title}>관상 분석 팁</Text>
        <View style={{flexDirection:'row', alignSelf: 'center', paddingBottom: 12.5}} >
          <ImageWithIconOverlay containerStyle={styles.tip_image} source={require('../assets/images/face_feature_hint1.png')}>
            <IconButton icon={'circle-outline'} size={23} iconColor={colors.white} style={styles.bottom_icon}/>
          </ImageWithIconOverlay>
          <ImageWithIconOverlay containerStyle={styles.tip_image} source={require('../assets/images/face_feature_hint2.png')}>
            <IconButton icon={'close'} size={23} iconColor={colors.white} style={styles.bottom_icon}/>
          </ImageWithIconOverlay>
        </View>
        <Text style={{margin: 4}}>단체사진이 아닌 눈,코,입 눈썹 등 얼굴 요소가 잘 드러난 독사진이어야 해요.</Text>
      </View>
    </View>
  );
  const resultContent = (
    <View style={styles.content_container}>
      {haveGeneratedS3Url ? 
      <ImageWithIconOverlay
        borderRadius={300} source={{uri: generatedS3Url}}
        containerStyle={styles.result_image_container} imageStyle={styles.image}>
        <IconButton icon={'check'} size={30} iconColor={colors.white} style={styles.result_bottom_icon}/>
      </ImageWithIconOverlay>:<></>
      }
      {/* 이 부분 코드는 나중에 관상 분석 결과 내용 나오면 수정 */}
      <View style={styles.result_container}>
        <Text style={styles.result_title}>위쪽으로 올라간 입꼬리</Text>
        <Text style={styles.result_content}>이런저런 이런저런 이런저런 성격을 가지는데...</Text>
        <Text style={styles.result_title}>살짝 튀어나온 광대</Text>
        <Text style={styles.result_content}>이런저런 이런저런 이런저런 성격을 가지는데...</Text>
        <Text style={styles.result_title}>평평한 눈썹</Text>
        <Text style={styles.result_content}>이런저런 이런저런 이런저런 성격을 가지는데...</Text>
      </View>
      <CustomButton containerStyle={{width: 73, height: 26}} textStyle={{fontSize: 12, color: colors.white}}>
        자세히 보기
      </CustomButton>
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <IconText 
        icon={{source: 'chat-question', color: colors.gray7}} 
        containerStyle={styles.hint_container}
        textStyle={{fontSize: 14, color: colors.gray7}}>AI 관상 분석은 무엇인가요? 🤔</IconText>
      <View>
        {contents[pageIndex]}
      </View>
      <View style={{flex: 1}}/>
      <View style={styles.bottom_container}>
        <CustomButton 
          containerStyle={isButtonClickable ? {backgroundColor: colors.point} : {backgroundColor: colors.pastel_point}} 
          onPress={clickButton}
          textStyle={{color: colors.white}} disabled={!isButtonClickable}
          >{pageIndex === contents.length - 1 ? "완료" : "다음"}</CustomButton>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 30,
    minHeight: '100%',
    justifyContent: 'center'
  },
  content_container: {
    justifyContent: 'center',
    paddingBottom: 15
  },

  // 이번 창의 단어 hint (ex. ai 관상은 무엇인가요?)
  hint_container: {
    backgroundColor: colors.light_pink, 
    height: 32, 
    paddingHorizontal: 16,
    borderRadius: 15, 
    alignSelf: 'center',
    marginVertical: 17
  },

  // 회색 tip, result 상자
  gray_container: {
    backgroundColor: colors.gray1, 
    padding: 11,
    marginTop: 40, 
    marginBottom: 18
  },
  result_container: {
    backgroundColor: colors.gray1, 
    padding: 22,
    flex: 1, 
    marginBottom: 18,
  },

  // 결과 회색 상자의 text style
  result_title: {
    paddingTop: 12,
    fontSize: 16,
    color: colors.point
  },
  result_content: {
    paddingTop: 5,
    fontSize: 14,
    color: colors.gray7
  },

  // tip 회색 상자의 text style
  tip_title: {
    width: '100%', 
    fontSize: 16, 
    color: colors.gray7, 
    padding: 11, 
    borderBottomWidth: 1, 
    borderBottomColor: colors.gray4,
    textAlign: 'center'
  },

  // tip 안에 있는 image style
  tip_image: {
    width: 80,
    height: 80, 
    margin: 10
  },
  // tip 안에 있는 image의 bottom icon style
  bottom_icon: {
    backgroundColor: colors.gray5, 
    borderWidth: 1, 
    borderColor: colors.white,
    position: 'absolute', 
    bottom: -22.5, 
    left: 12.5
  },

  // 이미지 color style
  setting_image_color: {
    backgroundColor: '#626262',
    borderColor: '#626262'
  },
  unsetting_image_color: {
    backgroundColor: colors.light_pink, 
    borderColor: colors.pastel_point
  },

  // 이미지 설정 style
  image: {
    width: 226, 
    height: 226, 
  },
  image_container: {
    width: 230, 
    height: 230, 
    alignSelf: 'center', 
    borderRadius: 300, 
    borderWidth: 2,
    borderColor: '#626262',
    backgroundColor: colors.light_pink,
    paddingTop: 33 // plus 중앙 배열을 위한 image_text 만큼의 크기 paddingTop으로 설정
  },
  result_image_container: {
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
  image_text: { 
    alignSelf: 'center', 
    height: 18, 
    marginBottom: 15, 
    fontSize: 14,
    color: colors.point
  },
  // result창의 이미지 style
  result_bottom_icon: {
    backgroundColor: colors.point, 
    borderWidth: 1, 
    borderColor: colors.point,
    position: 'absolute', 
    bottom: -30, 
    left: 85,
  },

  // bottom button container
  bottom_container: {
    alignItems: "center",
    marginBottom: 46,
    paddingHorizontal: 8,
  },
});

export default FaceFeaturePage;