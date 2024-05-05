import { useCallback, useContext, useEffect, useState } from "react";
import { View } from "react-native"
import AutoHeightImage from 'react-native-auto-height-image';

import { AuthContext } from '../store/auth-context.tsx';
import { errorResponse, getBasicInfo, getFaceInfo, isBasicInfoResponse, isErrorResponse, isFaceInfoResponse, isValidResponse } from "../util/auth";
import { createAlertMessage } from "../util/alert.tsx";
import { useFocusEffect } from "@react-navigation/native";

interface UserState {
  basicinfo: "LOADING" | "EXIST" | "NOT_EXIST" | "ERROR";
  faceinfo: "LOADING" | "EXIST" | "NOT_EXIST" | "ERROR";
}

const Home = ({ navigation }: any) => {
  const authCtx = useContext(AuthContext);
  const [reloadCounter, setReloadCounter] = useState(0);
  const [userState, setUserState] = useState<UserState>({ basicinfo: "LOADING", faceinfo: "LOADING" });

  const reload = () => {
    setReloadCounter(reloadCounter + 1);
  }

  // 로그아웃 후 Login 페이지로 이동
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

  // 토큰 재발급
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

  // 토큰 만료 시 토큰 재발급
  // 토큰 변조 시 로그아웃 후 Login 페이지로 이동
  // 통신 오류 시 리로드
  const handleErrorResponse = (response: errorResponse) => {
    console.log("handleErrorResponse");
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

  // 기본정보 로딩 후 userState.basicinfo 업데이트
  const setBasicInfoState = async () => {
    console.log("setBasicInfoState");
    if (authCtx.accessToken) {
      // 기본정보 get 시도
      console.log("기본정보 로딩 중");
      const basicInfoResponse = await getBasicInfo(authCtx.accessToken);
      console.log("기본정보 로딩 끝");

      // 기본정보 응답 확인
      if (isBasicInfoResponse(basicInfoResponse)) {
        // 기본정보 얻음
        if (basicInfoResponse.ageDegree && 
            basicInfoResponse.ageGroup &&
            basicInfoResponse.gender &&
            basicInfoResponse.heightGroup && 
            basicInfoResponse.nickname &&
            basicInfoResponse.region) {
            console.log("기본정보 있음");
            setUserState(prevState => {
              return { ...prevState, basicinfo: "EXIST" };
            });
        } else {
          console.log("기본정보 없음");
          setUserState(prevState => {
            return { ...prevState, basicinfo: "NOT_EXIST" };
          });
        }
      }
      if (isErrorResponse(basicInfoResponse)) {
        setUserState(prevState => {
          return { ...prevState, basicinfo: "ERROR" };
        });
        handleErrorResponse(basicInfoResponse);
      }
    }
  }

  // 마스크 이미지 로딩 후 userState.faceinfo 업데이트
  const setFaceinfoState = async () => {
    if (authCtx.accessToken) {
      console.log("마스크 이미지 로딩 중");
      const faceInfoResponse = await getFaceInfo(authCtx.accessToken);
      console.log("마스크 이미지 로딩 끝");

      if (isFaceInfoResponse(faceInfoResponse)) {
        if (faceInfoResponse.generatedS3Url !== "https://facefriend-s3-bucket.s3.ap-northeast-2.amazonaws.com/default-profile.png") {
          console.log("마스크 이미지 있음");
          setUserState(prevState => {
            return { ...prevState, faceinfo: "EXIST" };
          });
        }
        else {
          console.log("마스크 이미지 없음");
          setUserState(prevState => {
            return { ...prevState, faceinfo: "NOT_EXIST" };
          });
        }
      } else {
        console.log("마스크 이미지 없음");
        setUserState(prevState => {
          return { ...prevState, faceinfo: "NOT_EXIST" };
        });
      }
      if (isErrorResponse(faceInfoResponse)) {
        setUserState(prevState => {
          return { ...prevState, faceinfo: "ERROR" };
        });
        handleErrorResponse(faceInfoResponse);
      }
    }
  }
  
  // 유저 정보 로딩
  const loadInitialInfo = async () => {
    console.log("loadInitialInfo", authCtx.accessToken);
    setBasicInfoState();
    setFaceinfoState();
  }
  
  // 로딩된 유저 정보에 따라 라우팅
  const handleRoute = async () => {
    if (!authCtx.isAuthenticated) return;
    if (userState.basicinfo === "NOT_EXIST") {
      navigation.navigate("BasicInfo");
      return;
    }
    if (userState.faceinfo === "NOT_EXIST") {
      navigation.navigate("FaceInfo");
      return;
    }
    if (userState.basicinfo === "EXIST" && userState.faceinfo === "EXIST") {
      navigation.navigate("Main");
      return;
    }
  };
  
  // 엑세스 토큰 판별
  useFocusEffect(
    useCallback(() => {
      if (reloadCounter > 5) {
        logoutAndRedirect();
      }
      if (authCtx.isLoading) return;
      
      if (authCtx.accessToken) {
        console.log("엑세스 토큰 있음")
      } else {
        console.log("엑세스 토큰 없음")
        navigation.navigate("Login");
      }
    }, [authCtx.isLoading, authCtx.accessToken, reloadCounter])
  );
  
  // 엑세스 토큰이 있을 경우 유저 정보 로딩
  useFocusEffect(
    useCallback(() => {
      if (authCtx.accessToken) {
        loadInitialInfo();
      }
    }, [authCtx.accessToken])
  );

  // 로딩 되었을 경우 라우팅 실행
  useFocusEffect(
    useCallback(() => {
      if (userState.basicinfo !== "LOADING" && userState.faceinfo !== "LOADING") {
        console.log("userState:", JSON.stringify(userState));
        handleRoute();
      }
    }, [userState])
  );

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