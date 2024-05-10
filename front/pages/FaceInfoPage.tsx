import { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable, SafeAreaView } from 'react-native';
import CustomButton from '../components/CustomButton.tsx';

import { colors } from '../assets/colors.tsx';
import ImageWithIconOverlay from '../components/ImageWithIconOverlay.tsx';
import { showModal } from '../components/CameraComponent.tsx';
import IconText from '../components/IconText.tsx';
import { getBasicInfo, isBasicInfoResponse, putFaceInfo } from '../util/auth.tsx';
import { AuthContext } from '../store/auth-context.tsx';
import { createAlertMessage } from '../util/alert.tsx';
import AutoHeightImage from 'react-native-auto-height-image';
import { Gender } from '../util/basicInfoFormat.tsx';
import CustomBackHandler from '../components/CustomBackHandler.tsx';
import { UserContext } from '../store/user-context.tsx';

const FaceInfoPage = ({navigation}: any) => {
  // 이미지 uri path
  const [ uri, setUri ] = useState('');

  // auth와 페이지 전환을 위한 method
  const authCtx = useContext(AuthContext);
  const userCtx = useContext(UserContext);

  // 관상 생성 과정 이미지 자동 height 설정
  const [ exImageWidth, setExImageWidth ] = useState(0);
  const onLayout = (event: any) => {
    const {width} = event.nativeEvent.layout;
    setExImageWidth(width);
  }

  const [ isImageSetting, setIsImageSetting ] = useState(false);
  const [ isButtonClickable, setIsButtonClickable ] = useState(false);

  const [ pageIndex, setPageIndex ] = useState(0);

  // style 이미지 설정
  const [ selectedStyleId, setSelectedStyleId ] = useState<number>(-1);
  const [ gender, setGender ] = useState<keyof Gender>();

  const manStyleIdData = [
    {id: 17, source: require('../assets/images/cartoon-image/man/17.jpg')}, 
    {id: 30, source: require('../assets/images/cartoon-image/man/30.jpg')}, 
    {id: 32, source: require('../assets/images/cartoon-image/man/32.jpg')}, 
    {id: 43, source: require('../assets/images/cartoon-image/man/43.jpg')}, 
    {id: 72, source: require('../assets/images/cartoon-image/man/72.jpg')}, 
    {id: 209, source: require('../assets/images/cartoon-image/man/209.jpg')}, 
    {id: 237, source: require('../assets/images/cartoon-image/man/237.jpg')}, 
    {id: 255, source: require('../assets/images/cartoon-image/man/255.jpg')}, 
    {id: 302, source: require('../assets/images/cartoon-image/man/302.jpg')}, 
    {id: 313, source: require('../assets/images/cartoon-image/man/313.jpg')}
  ];
  const womanStyleIdData = [
    {id: 4, source: require('../assets/images/cartoon-image/woman/4.jpg')}, 
    {id: 53, source: require('../assets/images/cartoon-image/woman/53.jpg')}, 
    {id: 135, source: require('../assets/images/cartoon-image/woman/135.jpg')}, 
    {id: 156, source: require('../assets/images/cartoon-image/woman/156.jpg')}, 
    {id: 158, source: require('../assets/images/cartoon-image/woman/158.jpg')}, 
    {id: 208, source: require('../assets/images/cartoon-image/woman/208.jpg')}, 
    {id: 234, source: require('../assets/images/cartoon-image/woman/234.jpg')}, 
    {id: 243, source: require('../assets/images/cartoon-image/woman/243.jpg')}, 
    {id: 256, source: require('../assets/images/cartoon-image/woman/256.jpg')}, 
    {id: 299, source: require('../assets/images/cartoon-image/woman/299.jpg')}
  ];

  // 이미지 추가하는 방식 모달 가시성 설정
  const [ modalVisible, setModalVisible ] = useState(false);

  function setPhoto(uri: string) {
    setUri(uri);
    setIsImageSetting(true);
  }

  // 이미지 추가하는 방식(사진 찍기, 갤러리에서 사진 가져오기) 모달 보여주기
  function takePhoto() {
    setModalVisible(true);
  }

  function handleSelectedId(changeId: number) {
    if (selectedStyleId === changeId) {
      setSelectedStyleId(-1)
    } else {
      setSelectedStyleId(changeId);
    }
  }

  const clickButton = async () => {
    if (pageIndex === contents.length - 1) {
      if (authCtx.accessToken) {
        console.log('put face info', uri, selectedStyleId);
        putFaceInfo(
          authCtx.accessToken, 
          uri, selectedStyleId
        );
        createAlertMessage("이미지 생성이 오래 걸려, 생성이 다 되면, 프로필에서 보실 수 있습니다", ()=>{
          userCtx.setStatus('FACE_INFO_EXIST');
          navigation.goBack();
        })
      } else { // 실제에서는 절대 없는 예외 상황
        console.log("로그인 정보가 없습니다.");
      }
    } else {
      setPageIndex(1);
    }
  }

  const getGender = async () => {
    if (authCtx.accessToken) {
      const response = await getBasicInfo(
        authCtx.accessToken, 
      );

      if (isBasicInfoResponse(response)) {
        setGender(response.gender as keyof Gender);
        console.log(response.gender)
      }
        // 임시
    } else { // 실제에서는 절대 없는 예외 상황
      console.log("로그인 정보가 없습니다.");
    }
  }

  const setImageContent = (
    <View style={styles.contentContainer}>
      {showModal(modalVisible, () => {setModalVisible(false)}, setPhoto )}
      <IconText 
        icon={{source: 'chat-question', color: colors.gray7}} 
        containerStyle={styles.hintContainer}
        textStyle={{fontSize: 14, color: colors.gray7}}>AI 관상 생성은 무엇인가요? 🤔</IconText>
      <ImageWithIconOverlay
        borderRadius={300} source={{uri: uri}} imageStyle={styles.image}
        containerStyle={[styles.imageContainer, !isImageSetting ? styles.unsettingImageColor : styles.settingImageColor]}
        centerIcon={{size: 80, source: 'plus', color: !isImageSetting ? colors.pastel_point : colors.transparent}} 
        centerPressable={{onPress: () => takePhoto(), style:{alignSelf: 'center'}}}>
        {!isImageSetting ? <Text style={styles.imageText}>필수</Text> : undefined}
      </ImageWithIconOverlay>
      <View style={styles.grayContainer}>
        <Text style={styles.tipTitle} onLayout={onLayout}>마스크 생성 과정</Text>
        <AutoHeightImage width={exImageWidth} source={require('../assets/images/mask_ex.jpeg')} style={{marginVertical: 11}}/>
        <Text style={styles.tipText}>FACE FRIEND 에서는 실제 얼굴을 드러내지 않는 반익명 활동을 장려해요. 때문에 학습시킨 AI로 가상 마스크를 만들어요.</Text>
      </View>
    </View>
  );
  const setImageStyleContent = (
    <View style={styles.contentContainer}>
      <IconText 
        icon={{source: 'chat-question', color: colors.gray7}} 
        containerStyle={styles.hintContainer}
        textStyle={{fontSize: 14, color: colors.gray7}}>마스크에 적용하고 싶은 그림 스타일을 선택해주세요!</IconText>
      {
        (gender === 'FEMALE' ? womanStyleIdData : manStyleIdData).map(({id, source}: any) => {
          return (
            <Pressable key={id} onPress={() => handleSelectedId(id)}>
              <Image
                blurRadius={(id === selectedStyleId || selectedStyleId === -1) ? 0 : 20}
                style={styles.styleImage} source={source}/>
            </Pressable>
          );
        })
      }
    </View>
  );

  // 카메라에서 image를 가져오면 버튼 클릭 가능하게 수정
  useEffect(() => {
    if (!isImageSetting) return;
    setIsButtonClickable(true);
  }, [isImageSetting])

  useEffect(() => {
    getGender();
  }, [])

  // 선택한 style 이미지가 달라질 때마다 버튼 클릭 가능 여부 재설정
  useEffect(() => {
    if (selectedStyleId === -1) {
      setIsButtonClickable(false);
      return;
    }
    setIsButtonClickable(true);
  }, [selectedStyleId])

  // page 바뀌면, 버튼 클릭 못하게 수정
  useEffect(() => {
    setIsButtonClickable(false);
  }, [pageIndex])

  const contents = [
    setImageContent,
    setImageStyleContent
  ];

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.container}>
        <CustomBackHandler onBack={navigation.goBack}/>
        <View>
          {contents[pageIndex]}
        </View>
        <View style={{flex: 1}}/>
        <View style={styles.bottomContainer}>
          <CustomButton 
            containerStyle={isButtonClickable ? {backgroundColor: colors.point} : {backgroundColor: colors.pastel_point}} 
            onPress={clickButton}
            textStyle={{color: colors.white}} disabled={!isButtonClickable}
            >{pageIndex === contents.length - 1 ? "완료" : "다음"}</CustomButton>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 30,
    minHeight: '100%',
    justifyContent: 'center'
  },
  contentContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingBottom: 18
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

  // style 이미지들 margin 설정
  styleImage: {
    margin: 5, // 각 아이템 사이의 간격
    width: 150,
    height: 150
  },

  // tip 컨테이너
  grayContainer: {
    backgroundColor: colors.gray1, 
    padding: 11,
    marginTop: 40, 
  },

  // tip 회색 상자의 text style
  tipTitle: {
    width: '100%', 
    fontSize: 16, 
    color: colors.gray7, 
    padding: 11, 
    borderBottomWidth: 1, 
    borderBottomColor: colors.gray4,
    textAlign: 'center'
  },
  tipText: {
    fontSize: 14,
    color: colors.gray7,
    margin: 4
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
    paddingTop: 33 // plus 중앙 배열을 위한 imageText 만큼의 크기 paddingTop으로 설정
  },
  imageText: {
    alignSelf: 'center', 
    height: 18, 
    marginBottom: 15, 
    fontSize: 14,
    color: colors.point
  },

  // bottom button container
  bottomContainer: {
    alignItems: "center",
    marginBottom: 46,
    paddingHorizontal: 8,
  },
});

export default FaceInfoPage;