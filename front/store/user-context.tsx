import React, { createContext, useState, useEffect, useMemo, useContext} from 'react';
import Config from 'react-native-config';

import { getBasicInfo, getFaceInfo, isBasicInfoResponse, isErrorResponse, isFaceInfoResponse } from '../util/auth';
import { AuthContext } from './auth-context';

const UUID = '0';

interface BasicInfo {
  ageDegree: string, 
  ageGroup: string, 
  gender: string, 
  heightGroup: string, 
  nickname: string, 
  region: string,
}

interface FaceInfo {
  generatedS3Url: string,
  originS3Url: string,
}

interface UserState {
  basicinfo: string,
  faceinfo: string,
}

interface UserContextType {
  basicinfo: BasicInfo,
  faceinfo: FaceInfo,
  userState: UserState,
}

const defaultBasicInfo = {ageDegree: '', ageGroup: '', gender: '', heightGroup:'', nickname: '', region: ''};
const defaultFaceInfo = {generatedS3Url: '', originS3Url: ''};
const defaultUserState = {basicinfo: 'LOADING', faceinfo: 'LOADING'};

export const UserContext = createContext<UserContextType>({
  basicinfo: defaultBasicInfo,
  faceinfo: defaultFaceInfo,
  userState: defaultUserState,
});

interface ChatProviderProps {
  children: React.ReactNode;
}

const UserContextProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const authCtx = useContext(AuthContext);

  const [userState, setUserState] = useState<UserState>({ basicinfo: 'LOADING', faceinfo: 'LOADING' });
  const [basicinfo, setBasicinfo] = useState<BasicInfo>(defaultBasicInfo);
  const [faceinfo, setFaceinfo] = useState<FaceInfo>(defaultFaceInfo);
  
  // 기본정보 로딩 후 userState.basicinfo 업데이트
  const setBasicInfoState = async () => {
    console.log('setBasicInfoState');
    if (authCtx.accessToken) {
      // 기본정보 get 시도
      console.log('기본정보 로딩 중');
      const basicInfoResponse = await getBasicInfo(authCtx.accessToken);
      console.log('기본정보 로딩 끝');

      // 기본정보 응답 확인
      if (isBasicInfoResponse(basicInfoResponse)) {
        // 기본정보 얻음
        if (basicInfoResponse.ageDegree && 
            basicInfoResponse.ageGroup &&
            basicInfoResponse.gender &&
            basicInfoResponse.heightGroup && 
            basicInfoResponse.nickname &&
            basicInfoResponse.region) {
            console.log('기본정보 있음');
            setUserState(prevState => {
              return { ...prevState, basicinfo: 'EXIST' };
            });
            const newBasicInfo = {
              ageDegree: basicInfoResponse.ageDegree,
              ageGroup: basicInfoResponse.ageGroup,
              gender: basicInfoResponse.gender,
              heightGroup: basicInfoResponse.heightGroup,
              nickname: basicInfoResponse.nickname,
              region: basicInfoResponse.region
            }
            setBasicinfo(newBasicInfo);
        } else {
          console.log('기본정보 없음');
          setUserState(prevState => {
            return { ...prevState, basicinfo: 'NOT_EXIST' };
          });
          authCtx.setNavigate('BasicInfo');
        }
      }
      if (isErrorResponse(basicInfoResponse)) {
        setUserState(prevState => {
          return { ...prevState, basicinfo: 'ERROR' };
        });
        authCtx.handleErrorResponse(basicInfoResponse);
      }
    }
  }

  // 마스크 이미지 로딩 후 userState.faceinfo 업데이트
  const setFaceinfoState = async () => {
    if (authCtx.accessToken) {
      console.log('마스크 이미지 로딩 중');
      const faceInfoResponse = await getFaceInfo(authCtx.accessToken);
      console.log('마스크 이미지 로딩 끝');

      if (isFaceInfoResponse(faceInfoResponse)) {
        if (faceInfoResponse.generatedS3Url !== 'https://facefriend-s3-bucket.s3.ap-northeast-2.amazonaws.com/default-profile.png') {
          console.log('마스크 이미지 있음');
          setUserState(prevState => {
            return { ...prevState, faceinfo: 'EXIST' };
          });
          authCtx.setNavigate('Main');
        }
        else {
          console.log('마스크 이미지 없음');
          setUserState(prevState => {
            return { ...prevState, faceinfo: 'NOT_EXIST' };
          });
          authCtx.setNavigate('FaceInfo');
        }
      } else {
        console.log('마스크 이미지 없음');
        setUserState(prevState => {
          return { ...prevState, faceinfo: 'NOT_EXIST' };
        });
        authCtx.setNavigate('FaceInfo');
      }
      if (isErrorResponse(faceInfoResponse)) {
        setUserState(prevState => {
          return { ...prevState, faceinfo: 'ERROR' };
        });
        authCtx.handleErrorResponse(faceInfoResponse);
      }
    }
  }
  
  // 유저 정보 로딩
  const loadInitialInfo = async () => {
    console.log('loadInitialInfo', authCtx.accessToken);
    setBasicInfoState();
    setFaceinfoState();
  }

  // 엑세스 토큰이 있을 경우 유저 정보 로딩
  useEffect(() => {
    if (authCtx.accessToken) {
      loadInitialInfo();
    }
  }, [authCtx.accessToken]);

  // 로딩 되었을 경우 라우팅 실행
  useEffect(() => {
    if (userState.basicinfo !== 'LOADING' && userState.faceinfo !== 'LOADING') {
      console.log('userState:', JSON.stringify(userState));
      handleRoute();
    }
  }, [userState]);

  // 로딩된 유저 정보에 따라 라우팅
  const handleRoute = async () => {
    if (!authCtx.isAuthenticated) return;
    if (userState.basicinfo === 'NOT_EXIST') {
      authCtx.setNavigate('BasicInfo');
      return;
    }
    if (userState.faceinfo === 'NOT_EXIST') {
      authCtx.setNavigate('FaceInfo');
      return;
    }
    if (userState.basicinfo === 'EXIST' && userState.faceinfo === 'EXIST') {
      authCtx.setNavigate('Main');
      return;
    }
  };
  
  const value = useMemo(() => ({
    basicinfo,
    faceinfo,
    userState,
  }), []);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserContextProvider;

