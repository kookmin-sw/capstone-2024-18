import { useCallback, useContext, useEffect, useState } from "react";
import { View } from "react-native"
import AutoHeightImage from 'react-native-auto-height-image';

import { AuthContext } from '../store/auth-context.tsx';
import { getBasicInfo, getFaceInfo, isBasicInfoResponse, isErrorResponse, isFaceInfoResponse, isValidResponse } from "../util/auth";
import { createAlertMessage } from "../util/alert.tsx";
import { useFocusEffect } from "@react-navigation/native";

const Home = ({ navigation }: any) => {
  const authCtx = useContext(AuthContext);
  const [reloadCounter, setReloadCounter] = useState(0);

  const [haveBasicInfo, setHaveBasicInfo] = useState(false);
  const [haveFaceInfo, setHaveFaceInfo] = useState(true);
  const [haveFaceFeature, setHaveFaceFeature] = useState(false);
  
  const reload = () => {
    setReloadCounter(reloadCounter + 1);
  }

  const logoutAndRedirect = async () => {
    try {
      const response = await authCtx.signout();
      if (isValidResponse(response)) {
        navigation.navigate('Login');
      } 
      else {
        reload();
      }
    }
    catch {
      createAlertMessage("통신 중 오류가 발생했습니다.", reload)
    }
  }

  const tryReissue = async () => {
    try {
      const response = await authCtx.reissue();
      // 재발급 성공 시 재시도
      if (isValidResponse(response)) {
        console.log("재발급 성공");
        reload();
      }
      // 재발급 실패 시
      if (isErrorResponse(response)) {
        // 리프레시 토큰 만료 시 로그인 창으로 이동
        if (response.exceptionCode === 2004) {
          createAlertMessage(response.message, logoutAndRedirect);
        }
        // 통신 오류 시 재시도
        else {
          createAlertMessage(response.message, reload);
        }
      }
    }
    catch {
      createAlertMessage("통신 중 오류가 발생했습니다.", reload)
    }
  }

  const handleAuth = async () => {
    // 5회 이상 오류 시 로그아웃 후 로그인 창으로 이동
    if (reloadCounter > 5) {
      logoutAndRedirect();
    }
    try {
      // 앱 실행시 엑세스토큰이 있는지 체크
      if (authCtx.accessToken) {
        console.log("엑세스토큰 있음");
        
        if (!haveBasicInfo) {
          // 기본정보 get 시도
          console.log("기본정보 로딩 중", haveBasicInfo);
          const response = await getBasicInfo(authCtx.accessToken);
          console.log("기본정보 로딩 끝");

          // 기본정보 응답 확인
          if (isBasicInfoResponse(response)) {
            // 기본정보 얻음
            if (response.ageDegree && 
                response.ageGroup &&
                response.gender &&
                response.heightGroup && 
                response.nickname &&
                response.region) {
                console.log("기본정보 있음");
                setHaveBasicInfo(true);
              }
            else {
              console.log("기본정보 없음");
              navigation.navigate("BasicInfo");
            }
          } 
          else {
            // 오류 시 에러 메세지 출력 후 재시도
            console.log(response.message);
            createAlertMessage(response.message, reload);
          } 

          if (isErrorResponse(response)) {
            switch (response.exceptionCode) {
              case 2004: // EXPIRED_TOKEN 이미 만료된 토큰입니다.
                  if (authCtx.refreshToken) {
                  // 엑세스토큰 재발급 시도
                  console.log("재발급 시도");
                  tryReissue();
                }
                else {
                  console.log("리프레시 토큰 없음");
                  navigation.navigate("Login");
                }
                break;
              
              // 토큰 에러 시 
              case 2002: // SIGNATURE_NOT_FOUND JWT 서명을 확인하지 못했습니다.
              case 2003: // MALFORMED_TOKEN         토큰의 길이 및 형식이 올바르지 않습니다.
              case 2005: // UNSUPPORTED_TOKEN       지원되지 않는 토큰입니다.
              case 2006: // INVALID_TOKEN           토큰이 유효하지 않습니다.
              case 2007: // BAD_REQUEST_TO_PROVIDER 토큰이 유효하지 않습니다.
              case 2008: // UNAUTHORIZED            로그인한 정보가 없습니다.
                console.log("tokenError:", response.message);
                createAlertMessage(response.message, logoutAndRedirect);
                break;
              
              // 기본정보가 null인 경우
              case 0: 
                console.log("nullError:", response.message);
                break;
  
              // 그 외 통신 오류 등  
              default:
                console.log("default:", response.message);
                createAlertMessage(response.message, reload);
            }
          }
        }

        else if (!haveFaceInfo) {
          // 마스크 이미지 get 시도
          console.log("마스크 이미지 로딩 중");
          const response = await getFaceInfo(authCtx.accessToken);
          console.log("마스크 이미지 로딩 끝");

          // 마스크 이미지 응답 확인
          if (isFaceInfoResponse(response)) {
            // 기본정보 얻음
            if (response.originS3Url !== response.generatedS3Url) {
              console.log("마스크 이미지 있음");
              setHaveFaceInfo(true);
            }
            else {
              console.log("마스크 이미지 없음");
              navigation.navigate("FaceInfo");
            }
          } 
          else {
            // 오류 시 에러 메세지 출력 후 재시도
            console.log(response.message);
            createAlertMessage(response.message, reload);
          } 

          if (isErrorResponse(response)) {
            switch (response.exceptionCode) {
              case 2004: // EXPIRED_TOKEN 이미 만료된 토큰입니다.
                  if (authCtx.refreshToken) {
                  // 엑세스토큰 재발급 시도
                  console.log("재발급 시도");
                  tryReissue();
                }
                else {
                  console.log("리프레시 토큰 없음");
                  navigation.navigate("Login");
                }
                break;
              
              // 토큰 에러 시 
              case 2002: // SIGNATURE_NOT_FOUND JWT 서명을 확인하지 못했습니다.
              case 2003: // MALFORMED_TOKEN         토큰의 길이 및 형식이 올바르지 않습니다.
              case 2005: // UNSUPPORTED_TOKEN       지원되지 않는 토큰입니다.
              case 2006: // INVALID_TOKEN           토큰이 유효하지 않습니다.
              case 2007: // BAD_REQUEST_TO_PROVIDER 토큰이 유효하지 않습니다.
              case 2008: // UNAUTHORIZED            로그인한 정보가 없습니다.
                console.log("tokenError:", response.message);
                createAlertMessage(response.message, logoutAndRedirect);
                break;
              
              // 기본정보가 null인 경우
              case 0: 
                console.log("nullError:", response.message);
                break;
  
              // 그 외 통신 오류 등  
              default:
                console.log("default:", response.message);
                createAlertMessage(response.message, reload);
            }
          }
        }
        
        else if (!haveFaceFeature) {
          // 관상 분석 get 시도
          setHaveFaceFeature(true);
        }
      }
      else {
        console.log("엑세스토큰 없음");
        navigation.navigate("Login");
      }
    }
    catch {
      createAlertMessage("통신 중 오류가 발생했습니다.", reload);
    }
  }

  useFocusEffect(
    useCallback(() => {
      console.log("reloadCounter: " + reloadCounter);
      if (!authCtx.isLoading) {
        handleAuth();
      }
    }, [reloadCounter, authCtx.isLoading, navigation])
  );

  useEffect(() => {
    if (haveBasicInfo && haveFaceInfo && haveFaceFeature) navigation.navigate('Main');
    else {
      console.log("reloadCounter: " + reloadCounter);
      if (!authCtx.isLoading) {
        handleAuth();
      }
    }
  }, [haveBasicInfo, haveFaceInfo, haveFaceFeature])

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <AutoHeightImage
        width={200}
        style={{alignSelf:"center", marginHorizontal: 80}}
        source={require('../assets/images/logo_origin.png')}
      />
    </View>
  )
}

export default Home;