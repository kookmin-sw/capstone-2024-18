import React, { createContext, useState, useEffect, useMemo, useContext} from 'react';

import { getAnalysisInfoShort, getBasicInfo, getFaceInfo, isAnalysisShortResponse, isBasicInfoResponse, isErrorResponse, isFaceInfoDefaultResponse, isFaceInfoResponse } from '../util/auth';
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
  generatedS3url: string,
  originS3url: string,
}

interface UserContextType {
  basicinfo: BasicInfo,
  faceinfo: FaceInfo,
  status: string,
  setBasicinfo: (basicInfo: BasicInfo) => void,
  setFaceinfo: (faceInfo: FaceInfo) => void,
  setStatus: (status: string) => void,
}

const defaultBasicInfo = {ageDegree: '', ageGroup: '', gender: '', heightGroup:'', nickname: '', region: ''};
const defaultFaceInfo = {generatedS3url: '', originS3url: ''};

export const UserContext = createContext<UserContextType>({
  basicinfo: defaultBasicInfo,
  faceinfo: defaultFaceInfo,
  status: '',
  setBasicinfo: (basicInfo: BasicInfo) => {},
  setFaceinfo: (faceInfo: FaceInfo) => {},
  setStatus: (status: string) => {},
});

interface ChatProviderProps {
  children: React.ReactNode;
}

const UserContextProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const authCtx = useContext(AuthContext);

  const [status, setStatus] = useState('');
  const [basicinfo, setBasicinfo] = useState<BasicInfo>(defaultBasicInfo);
  const [faceinfo, setFaceinfo] = useState<FaceInfo>(defaultFaceInfo);
  
  // 기본정보 로딩 후 userState.basicinfo 업데이트
  const setBasicInfoState = async () => {
    console.log('setBasicInfoState');
    if (authCtx.accessToken) {
      // 기본정보 get 시도
      const basicInfoResponse = await getBasicInfo(authCtx.accessToken);

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
            setStatus('BASIC_INFO_EXIST');
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
          setStatus('BASIC_INFO_NOT_EXIST');
        }
      }
      if (isErrorResponse(basicInfoResponse)) {
        setStatus('BASIC_INFO_ERROR');
        authCtx.handleErrorResponse(basicInfoResponse);
      }
    }
  }

  // 마스크 이미지 로딩 후 userState.faceinfo 업데이트
  const setFaceInfoState = async () => {
    if (authCtx.accessToken) {
      const faceInfoResponse = await getFaceInfo(authCtx.accessToken);

      if (isFaceInfoResponse(faceInfoResponse)) {
        if (!isFaceInfoDefaultResponse(faceInfoResponse)) {
          console.log('마스크 이미지 있음');
          setStatus('FACE_INFO_EXIST');
        }
        else {
          console.log('마스크 이미지 없음');
          setStatus('FACE_INFO_NOT_EXIST');
        }
      } else {
        console.log('마스크 이미지 없음');
        setStatus('FACE_INFO_NOT_EXIST');
      }
      if (isErrorResponse(faceInfoResponse)) {
        setStatus('FACE_INFO_ERROR');
        authCtx.handleErrorResponse(faceInfoResponse);
      }
    }
  }
  
  // 마스크 이미지 로딩 후 userState.faceinfo 업데이트
  const setAnalysisInfoState = async () => {
    if (authCtx.accessToken) {
      const response = await getAnalysisInfoShort(authCtx.accessToken);

      if (isAnalysisShortResponse(response)) {
        console.log("관상 분석 있음");
        setStatus("FACE_FEATURE_EXIST");
      } else {
        console.log("관상 분석 없음");
        setStatus("FACE_FEATURE_NOT_EXIST");
      }
      if (isErrorResponse(response)) {
        console.log("관상 분석 에러");
        setStatus("FACE_FEATURE_ERROR");
      }
    }
  }
  useEffect(() => {
    if (authCtx.status === 'INITIALIZED') {
      setBasicInfoState();
    };
  }, [authCtx.status])

  useEffect(() => {
    if (status === 'BASIC_INFO_EXIST') {
      setFaceInfoState();
    };
    if (status === 'FACE_INFO_EXIST') {
      setAnalysisInfoState();
    };
  }, [authCtx.status, status])

  const value = useMemo(() => ({
    basicinfo,
    faceinfo,
    status,
    setBasicinfo,
    setFaceinfo,
    setStatus,
  }), [basicinfo, faceinfo, status]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserContextProvider;

