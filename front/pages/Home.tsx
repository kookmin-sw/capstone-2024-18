import { useContext, useEffect, useState } from "react";
import { View } from "react-native"
import AutoHeightImage from 'react-native-auto-height-image';
import { useNavigate } from "react-router-native";

import { AuthContext } from '../store/auth-context.tsx';
import { getBasicInfo, isBasicInfoResponse, isErrorResponse, isValidResponse } from "../util/auth";
import { createAlertMessage } from "../util/alert.tsx";

const Home = () => {
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const [reloadCounter, setReloadCounter] = useState(0);
  
  const reload = () => {
    setReloadCounter(reloadCounter + 1);
  }

  const handleAuth = async () => {

    // 3회 이상 오류 시 로그아웃 후 로그인 창으로 이동
    if (reloadCounter > 2) {
      const response = await authCtx.signout();
      if (isValidResponse(response)) {
        navigate('/login');
      }
      else {
        reload();
      }
    }

    // 앱 실행시 엑세스토큰이 있는지 체크
    if (authCtx.accessToken) {
      console.log("엑세스토큰 있음");

      // 기본정보 체크
      const response = await getBasicInfo(authCtx.accessToken);
      if (isErrorResponse(response)) {
        // 엑세스토큰 만료 시
        if (response.exceptionCode === 2004) {
          // 리프레시 토큰이 있는 경우
          if (authCtx.refreshToken) {
            // 엑세스토큰 재발급 시도
            console.log("재발급 시도");
            const response = await authCtx.reissue();
            // 재발급 성공시 새로고침
            if (isValidResponse(response)) {
              console.log("재발급 성공");
              reload();
            }
            // 재발급 실패 시 로그인 페이지로 이동
            else {
              console.log("재발급 실패");
              navigate("/login");
            }
          }
        }
        else {
          console.log("통신 오류");
          createAlertMessage("통신 오류가 발생했습니다.", reload);
        }
      }

      if (isBasicInfoResponse(response)) {
        // 기본정보 있음
        console.log("기본정보 있음");
        navigate("/main");
      } 
      else {
        if (response.exceptionCode === 0) {
          // 기본정보 없음
          console.log("기본정보 없음");
          navigate("/basic-info");
        }
        else {
          console.log("통신 오류");
          createAlertMessage("통신 오류가 발생했습니다.", reload);
        }
      } 
    }
    
    // 리프레시 토큰이 없는 경우 로그인 페이지로 이동
    else if (authCtx.refreshToken) {
      console.log("리프레시 토큰 있음");
      navigate("/");
    }

    else {
      console.log("리프레시 토큰 없음");
      navigate("/login");
    }
  }

  useEffect(() => {
    handleAuth();
    console.log("reloadCounter: " + reloadCounter);
  }, [reloadCounter])

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