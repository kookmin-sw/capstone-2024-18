import React, { createContext, useState, useEffect, useMemo, useContext} from 'react';

import { analysisResponse, getAnalysisInfoShort, getBasicInfo, getFaceInfo, getMyResume, isAnalysisShortResponse, isBasicInfoResponse, isErrorResponse, isFaceInfoDefaultResponse, isFaceInfoResponse, isResumeResponse, resumeResponse } from '../util/auth';
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
  analysisinfo: analysisResponse | undefined,
  resumeinfo: resumeResponse | undefined,
  status: string,
  setBasicinfo: (basicInfo: BasicInfo) => void,
  setFaceinfo: (faceInfo: FaceInfo) => void,
  setAnalysisinfo: (analysisInfo: analysisResponse | undefined) => void,
  setResumeinfo: (resumeInfo: resumeResponse | undefined) => void,
  setStatus: (status: string) => void,
}

const defaultBasicInfo = {ageDegree: '', ageGroup: '', gender: '', heightGroup:'', nickname: '', region: ''};
const defaultFaceInfo = {generatedS3url: '', originS3url: ''};

export const UserContext = createContext<UserContextType>({
  basicinfo: defaultBasicInfo,
  faceinfo: defaultFaceInfo,
  analysisinfo: undefined,
  resumeinfo: undefined,
  status: '',
  setBasicinfo: (basicInfo: BasicInfo) => {},
  setFaceinfo: (faceInfo: FaceInfo) => {},
  setAnalysisinfo: (analysisInfo: analysisResponse | undefined) => {},
  setResumeinfo: (resumeInfo: resumeResponse | undefined) => {},
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
  const [analysisinfo, setAnalysisinfo] = useState<analysisResponse>();
  const [resumeinfo, setResumeinfo] = useState<resumeResponse>();

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
        const newFaceInfo = {
          generatedS3url: faceInfoResponse.generatedS3url,
          originS3url: faceInfoResponse.originS3url
        }
        if (!isFaceInfoDefaultResponse(faceInfoResponse)) {
          console.log('마스크 이미지 있음');
          setFaceinfo(newFaceInfo);
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
        setAnalysisinfo(response);
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

  // 마스크 이미지 로딩 후 userState.faceinfo 업데이트
  const setResumeState = async () => {
    if (authCtx.accessToken) {
      console.log("관상 분석 로딩 중");
      const response = await getMyResume(authCtx.accessToken);
      console.log("관상 분석 로딩 끝");

      if (isResumeResponse(response)) {
        console.log("자기소개서 있음");
        setResumeinfo(response);
        setStatus("RESUME_EXIST");
      } else {
        console.log("자기소개서 없음");
        setStatus("RESUME_NOT_EXIST");
      }
      if (isErrorResponse(response)) {
        console.log("자기소개서 에러");
        setStatus("RESUME_ERROR");
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
    if (status === 'FACE_FEATURE_EXIST') {
      setResumeState();
    };
  }, [authCtx.status, status])

  useEffect(() => {
    setResumeState();
  }, [basicinfo, faceinfo, analysisinfo])

  const value = useMemo(() => ({
    basicinfo,
    faceinfo,
    analysisinfo,
    resumeinfo,
    status,
    setBasicinfo,
    setFaceinfo,
    setAnalysisinfo,
    setResumeinfo,
    setStatus,
  }), [basicinfo, faceinfo, analysisinfo, resumeinfo, status]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserContextProvider;

