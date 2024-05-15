import React, { useEffect } from "react";
import {View, Text, Alert, StyleSheet, Pressable, Modal, Platform} from 'react-native'
import {launchCamera,launchImageLibrary, CameraOptions, ImagePickerResponse, ImageLibraryOptions, Asset} from 'react-native-image-picker';
import {PermissionsAndroid} from 'react-native';
import { colors } from "../assets/colors";


/**
 * 안드로이드 기기에서의 사진, 갤러리 사용 모달
 * @param visible :boolean. modal의 가시성 설정
 * @param onClose :()=>void. modal의 취소 버튼, 모달 이외의 배경 클릭시 실행되는 함수
 * @param setImageUrl :(uri: string)=>void. 사진을 찍거나 가져올 때 사진을 따로 사용해야할 경우, 함수 설정
 * @returns :모달 내용
 */
export const showModal = (visible: boolean, onClose: () => void, setImageUrl?: (uri: string) => void) => {
  // 카메라 안드로이드 권한 확인(카메라, 갤러리 접근 둘다 확인)
  useEffect(() => {
    checkCameraPermission();
    checkGalleryPermission();
  }, [])
  
  // 모달 안의 버튼을 클릭하면, 현재 모달을 닫고, 해당 버튼 기능 실행
  function pressCamera() {
    onClose();
    showCamera(setImageUrl && setImageUrl);
  }
  function pressPhoto() {
    onClose();
    showPhoto(setImageUrl && setImageUrl);
  }
  
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}>
      <Pressable style={styles.background} onPress={onClose}>
        <View style={styles.whiteBox}>

          <Pressable style={styles.actionButton} onPress={pressCamera}>
            <Text style={{color: colors.gray8, fontSize: 18, fontFamily: 'Pretendard-Medium'}}>카메라로 촬영하기</Text>
          </Pressable>

          <Pressable style={styles.actionButton} onPress={pressPhoto}>
            <Text style={{color: colors.gray8, fontSize: 18, fontFamily: 'Pretendard-Medium'}}>사진 선택하기</Text>
          </Pressable>

        </View>
      </Pressable>
    </Modal>
  );
}

/**
 * Camera 기능 관련 안드로이드 Permission이 있는지 확인하고, (허용이나 거부 내용) 없으면, Permission 요청
 */
const checkCameraPermission = async () => {
  const granted = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.CAMERA,
  );
  if (!granted) {
    requestCameraPermission();
  }
}

/**
 * Camera 기능 관련 안드로이드 Permission 요청
 */
const requestCameraPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Camera Permission',
        message: 'This app needs access to your camera.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Camera permission granted');
    } else {
      console.log('Camera permission denied');
      Alert.alert(
        'Permission Denied',
        'Please allow camera permission to take photos.',
      );
    }
  } catch (err) {
    console.warn(err);
  }
}

/**
 * Gallery 이미지 읽는 기능 관련 안드로이드 Permission이 있는지 확인하고, (허용이나 거부 내용) 없으면, Permission 요청
 * 이때 안드로이드 Version에 따라 요청하는 Permission 분기
 */
const checkGalleryPermission = async () => {
  const granted = await PermissionsAndroid.check(
    (parseInt(Platform.Version as string, 10) >= 33) ? 
      PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES :
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
  );
  if (!granted) {
    requestGalleryPermission();
  }
}

/**
 * Gallery 이미지 읽는 기능 관련 안드로이드 Permission 요청
 * 이때 안드로이드 Version에 따라 요청하는 Permission 분기
 */
const requestGalleryPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      (parseInt(Platform.Version as string, 10) >= 33) ? 
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES :
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
        title: 'Gallery Permission',
        message: 'This app needs access to your gallery.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Gallery permission granted');
    } else {
      console.log('Gallery permission denied');
      Alert.alert(
        'Permission Denied',
        'Please allow gallery permission to take photos.',
      );
    }
  } catch (err) {
    console.warn(err);
  }
}

/** 
 * 카메라를 이용하여 사진을 찍고, 찍은 사진을 사용하는 함수
 * @param setResult :(uri: string) => void. 찍은 이미지 임시 저장한 파일을 사용하는 함수 전달
*/
const showCamera = (setResult?: (uri: string) => void)=> {
  const options : CameraOptions = {
      mediaType : 'photo', //필수 속성
      cameraType : 'back',
      saveToPhotos : true,
      quality : 1,
      videoQuality : "high",
  }

  launchCamera(options , (response:ImagePickerResponse)=>{
    if(response.didCancel) { // 뒤로가기, cancel
      console.log('촬영취소')
    }
    else if(response.errorMessage) { // 예상치 못한 에러 상황
      Alert.alert('Error : '+ response.errorMessage)
    }
    else { // 사진 촬영 기능 수행
      if(response.assets != null) {
        const uri = response.assets[0].uri

        if (uri) {
          setResult && setResult(uri);
        } else {
          setResult && setResult('');
        }
      }
    }
  })
}

/** 
 * 갤러리에서 사진을 선택하고, 선택한 사진을 사용내는 함수
 * @param setResult :(uri: string) => void. 선택한 이미지 파일을 사용하는 함수 전달
*/
const showPhoto = async (setResult?: (uri: string) => void)=> {
  const option: ImageLibraryOptions = {
    mediaType : "photo",
    selectionLimit : 5,
  }

  const response = await launchImageLibrary(option)

  if(response.didCancel) { // 뒤로가기, cancel 
    console.log('취소')
  }
  else if(response.errorMessage) { // 예상치 못한 에러 상황
    Alert.alert('Error : '+ response.errorMessage)
  }
  else {
    const uris:Asset[] = []
    response.assets?.forEach((value)=>uris.push(value))

    if (uris[0].uri) {
      setResult && setResult(uris[0].uri);
    } else {
      setResult && setResult('');
    }
    
    return uris[0]
  }
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  whiteBox: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 4,
    elevation: 2,
  },
  actionButton: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: colors.gray7
  },
})