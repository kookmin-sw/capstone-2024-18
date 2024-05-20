import axios from 'axios';
import RNFS from 'react-native-fs';
// import RNFetchBlob from 'rn-fetch-blob';
import Config from 'react-native-config';
import { Category, category as categoryFormat } from './categoryFormat';
import { useState } from 'react';

const LOCALHOST = Config.LOCALHOST;

export interface validResponse {
  method: string;
  status: number,
  message: string;
}

export interface errorResponse {
  method: string,
  status: number,
  exceptionCode?: number,
  message: string,
}

interface CharObject {
  [key: string]: string; // Index signature
}

const toString = (html: CharObject) => {
  let result = "";
    for (let key in html) {
      if (html.hasOwnProperty(key)) {
        result += html[key];  // 각 문자를 결과 문자열에 추가
      }
    }
    return result;
}

export const handleError = (error: unknown, method: string): errorResponse => {
  let errorInfo;

  if (axios.isAxiosError(error)) {

    // 요청이 전송되었고, 서버는 2xx 외의 상태 코드로 응답했습니다.
    if (error.response) {
      console.log(error)
      const httpErrorCode = error.response.status;
      const errorDetails = error.response?.data ? { ...error.response.data } : {};  
      
      errorInfo = {
        method,
        status: httpErrorCode,
        message: errorDetails.message,
        exceptionCode: errorDetails.exceptionCode,
      };
    }

    // 요청이 전송되었지만, 응답이 수신되지 않았습니다.
    else if (error.request) { 
      errorInfo = {
        method,
        status: 0,
        message: "서버로부터 응답이 없습니다.",
      };
    }

    // 요청을 설정하는 동안 문제가 발생했습니다.
    else {
      errorInfo = {
        method,
        status: -1,
        message: "요청을 설정하는 동안 문제가 발생했습니다.",
      }
    }
    
  } 
  
  else if (error instanceof Error) {
    errorInfo = {
      method,
      status: -2,
      message: `${method}에서 예상치 못한 에러 발생: ${error.message}`,
    }
  } 
  
  else {
    errorInfo = {
      method,
      status: -3,
      message: `${method}에서 처리할 수 없는 예상치 못한 에러 발생`,
    }
  }
  
  console.log("handleError:", JSON.stringify(errorInfo));
  return errorInfo;
}

interface findEmailResponse extends validResponse {
  receivedEmail: string; 
  isRegistered: boolean; 
}

// 1. OK
export const findEmail = async (email: string): Promise<findEmailResponse | errorResponse> => {
  const method = "findEmail";
  const endpoint = `${LOCALHOST}/auth/find-email?email=${email}`;
  try {
    const response = await axios.post(endpoint);
    const { email: receivedEmail, isRegistered } = response.data;
    if (email !== receivedEmail) {
      throw new Error(`${method}에서 예상치 못한 에러 발생 ${JSON.stringify(response.data)}`);
    }
    const responseInfo = {
      method,
      status: response.status,
      message: "가입된 이메일입니다.",
      receivedEmail,
      isRegistered,
    }
    console.log(responseInfo);
    return responseInfo;
  }
  catch (error) {
    return handleError(error, method);
  }
}

// 2. OK
export const sendTemporaryPassword = async (email: string): Promise<validResponse | errorResponse> => {
  const method = "sendTemporaryPassword";
  const endpoint = `${LOCALHOST}/auth/send-temporary-password?email=${email}`;
  try {
    const response = await axios.post(endpoint);
    const responseInfo = {
      method,
      status: response.status,
      message: "이메일로 임시 비밀번호를 전송했습니다."
    }
    console.log(responseInfo);
    return responseInfo;
  }
  catch (error) {
    return handleError(error, method);
  }
}

// 3. OK
export const verifyTemporaryPassword = async (email: string, temPassword: string, newPassword: string, newPassword2: string): Promise<validResponse | errorResponse> => {
  const method = "verifyTemporaryPassword";
  const endpoint = `${LOCALHOST}/auth/verify-temporary-password?email=${email}&temporaryPassword=${temPassword}`;
  const body = { newPassword, newPassword2, }
  try {
    const response = await axios.post(endpoint, body);
    const responseInfo = {
      method,
      status: response.status,
      message: "비밀번호가 재설정되었습니다."
    }
    console.log(responseInfo);
    return responseInfo;
  }
  catch (error) {
    return handleError(error, method);
  }
}

// 4. OK
export const verifyDuplicationEmail = async (email: string): Promise<validResponse | errorResponse> => {
  const method = "verifyDuplicationEmail";
  const endpoint = `${LOCALHOST}/auth/verify-duplication?email=${email}`;
  try {
    const response = await axios.post(endpoint);
    const responseInfo = {
      method,
      status: response.status,
      message: "사용 가능한 이메일입니다."
    }
    console.log(responseInfo);
    return responseInfo;
  }
  catch (error) {
    return handleError(error, method);
  }
}

// 5. OK
export const sendCode = async (email: string): Promise<validResponse | errorResponse> => {
  const method = "sendCode";
  const endpoint = `${LOCALHOST}/auth/send-code?email=${email}`;
  try {
    const response = await axios.post(endpoint);
    const responseInfo = {
      method,
      status: response.status,
      message: "이메일로 인증코드를 전송했습니다.",
    }
    console.log(responseInfo);
    return responseInfo;
  }
  catch (error) {
    return handleError(error, method);
  }
}

// 6. OK
interface verifyCodeResponse extends validResponse{
  email: string; 
  isVerified: boolean; 
}

export const verifyCode = async (email: string, code: string): Promise<verifyCodeResponse | errorResponse> => {
  const method = "verifyCode";
  const endpoint = `${LOCALHOST}/auth/verify-code?email=${email}&code=${code}`;
  try {
    const response = await axios.get(endpoint);
    const { email: receivedEmail, isVerified } = response.data;
    if (email !== receivedEmail) {
      throw new Error(`${method}에서 예상치 못한 에러 발생 ${JSON.stringify(response.data)}`);
    }
    const responseInfo = {
      method,
      status: response.status,
      message: isVerified ? "인증되었습니다." : "인증번호가 일치하지 않습니다.",
      email: receivedEmail,
      isVerified,
    }
    console.log(responseInfo);
    return responseInfo;
  }
  catch (error) {
    return handleError(error, method);
  }
}

// 7. OK
export const signup = async (email: string, password: string, password2: string, isVerified: boolean): Promise<validResponse | errorResponse> => {
  const method = "signup";
  const endpoint =  `${LOCALHOST}/auth/signup`;
  const body = {
    email,
    password,
    password2,
  }
  try {
    const response = await axios.post(endpoint, body);
    const responseInfo = {
      method,
      status: response.status,
      message: "회원가입이 완료되었습니다.",
    }
    console.log(responseInfo);
    return responseInfo;
  }
  catch (error) {
    return handleError(error, method);
  }
}

interface basicInfoResponse extends validResponse {
  nickname: string;
  gender: string;
  ageGroup: string;
  ageDegree: string;
  heightGroup: string;
  region: string;
}

// 13.
export const getBasicInfo = async (accessToken: string): Promise<basicInfoResponse | errorResponse> => {
  const method = "getBasicInfo";
  const endpoint =  `${LOCALHOST}/basic-info`;
  const config = { 
    headers: { Authorization: 'Bearer ' + accessToken } 
  };
  try {
    const response = await axios.get(endpoint, config);
    const { nickname, gender, ageGroup, ageDegree, heightGroup, region } = response.data;
    const responseInfo = {
      method,
      status: response.status,
      message: "기본 정보를 로드했습니다.",
      nickname,
      gender,
      ageGroup,
      ageDegree,
      heightGroup,
      region,
    }
    // console.log(responseInfo);
    return responseInfo;
  }
  catch (error) {
    return handleError(error, method);
  }
}

// 14.
export const putBasicInfo = async (
    accessToken: string, 
    nickname: string, 
    gender: string,
    ageGroup: string,
    ageDegree: string ,
    heightGroup: string, 
    region: string, 
  ): Promise<validResponse | errorResponse> => {
  const method = "putBasicInfo";
  const endpoint =  `${LOCALHOST}/basic-info`;
  const config = { 
    headers: { Authorization: 'Bearer ' + accessToken } 
  };
  const body = {
    nickname,
    gender,
    ageGroup,
    ageDegree,
    heightGroup,
    region,
  }
  try {
    const response = await axios.put(endpoint, body, config);
    const responseInfo = {
      method,
      status: response.status,
      message: "기본 정보를 저장했습니다.",
    }
    console.log(responseInfo);
    return responseInfo;
  }
  catch (error) {
    return handleError(error, method);
  }
}

interface faceInfoResponse extends validResponse {
  originS3url: string,
  generatedS3url: string
}

// 15.
export const getFaceInfo = async (accessToken: string): Promise<faceInfoResponse | errorResponse> => {
  const method = "getFaceInfo";
  const endpoint =  `${LOCALHOST}/face-info`;
  const config = { 
    headers: { Authorization: 'Bearer ' + accessToken } 
  };
  try {
    const response = await axios.get(endpoint, config);
    const { originS3url, generatedS3url } = response.data;
    const responseInfo = {
      method,
      status: response.status,
      message: "관상 이미지를 로드했습니다.",
      originS3url, 
      generatedS3url
    }
    // console.log(responseInfo);
    return responseInfo;
  }
  catch (error) {
    return handleError(error, method);
  }
}

const getMimeTypeFromExtension = (extension: string | undefined) => {
  switch (extension) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    default:
      return 'application/octet-stream'; // 기본값으로 설정합니다. 
  }
};

// 17.
export const putFaceInfo = async (accessToken: string, fileUri: string, styleId: number): Promise<faceInfoResponse | errorResponse> => {
  // 파일의 확장자를 추출
  const extension = fileUri.split('.').pop()?.toLowerCase();
  // 파일(이미지)의 타입을 결정
  const mimeType = getMimeTypeFromExtension(extension);
  
  // FormData 객체를 생성합니다.
  const formData = new FormData();
  formData.append('origin', {
    uri: fileUri,
    name: `file.${extension}`,
    type: mimeType,
  });

  const method = "putFaceInfo";
  const endpoint = `${LOCALHOST}/face-info?styleId=${styleId}`;
  const config = { 
    headers: { 
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'multipart/form-data',
    }
  };
  try {
    const response = await axios.put(endpoint, formData, config);
    const { originS3url, generatedS3url } = response.data;
    const responseInfo = {
      method,
      status: response.status,
      message: "관상 이미지를 수정했습니다.",
      originS3url, 
      generatedS3url
    }
    console.log(responseInfo);
    return responseInfo;
  }
  catch (error) {
    return handleError(error, method);
  }
}

// 18.
export const deleteFaceInfo = async (accessToken: string): Promise<faceInfoResponse | errorResponse> => {
  const method = "deleteFaceInfo";
  const endpoint =  `${LOCALHOST}/face-info`;
  const config = { 
    headers: { Authorization: 'Bearer ' + accessToken } 
  };
  try {
    const response = await axios.delete(endpoint, config);
    const { originS3url, generatedS3url } = response.data;
    const responseInfo = {
      method,
      status: response.status,
      message: "관상 이미지를 초기화했습니다.",
      originS3url, 
      generatedS3url
    }
    console.log(responseInfo);
    return responseInfo;
  }
  catch (error) {
    return handleError(error, method);
  }
}

export interface analysisResponse extends validResponse {
  analysisShort: string[];
  analysisFull: {string: string};
}

// 19.
export const getAnalysisInfo = async (accessToken: string): Promise<analysisResponse | errorResponse> => {
  const method = "getAnalysisInfo";
  const endpoint =  `${LOCALHOST}/analysis-info/full-short`;
  const config = { 
    headers: { Authorization: 'Bearer ' + accessToken } 
  };
  try {
    const response = await axios.get(endpoint, config);
    const { analysisFull, analysisShort } = response.data;
    const responseInfo = {
      method,
      status: response.status,
      message: "관상 분석을 로드했습니다.",
      analysisFull,
      analysisShort
    }
    // console.log(responseInfo);
    return responseInfo;
  }
  catch (error) {
    return handleError(error, method);
  }
}

// 20.
export const putAnalysisInfo = async (accessToken: string, fileUri: string): Promise<analysisResponse | errorResponse> => {
  // 파일의 확장자를 추출
  const extension = fileUri.split('.').pop()?.toLowerCase();
  // 파일(이미지)의 타입을 결정
  const mimeType = getMimeTypeFromExtension(extension);
  
  // FormData 객체를 생성합니다.
  const formData = new FormData();
  formData.append('origin', {
    uri: fileUri,
    name: `file.${extension}`,
    type: mimeType,
  });

  const method = "putAnalysisInfo";
  const endpoint = `${LOCALHOST}/analysis-info`;
  const config = { 
    headers: { 
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'multipart/form-data',
    }
  };
  try {
    const response = await axios.put(endpoint, formData, config);
    const { analysisFull } = response.data;
    const responseInfo = {
      method,
      status: response.status,
      message: "관상 정보를 생성했습니다.",
      analysisFull
    }
    console.log(responseInfo);
    return responseInfo;
  }
  catch (error) {
    return handleError(error, method);
  }
}

// 21.
export const getAnalysisInfoFull = async (accessToken: string): Promise<analysisResponse | errorResponse> => {
  const method = "getAnalysisInfoFull";
  const endpoint =  `${LOCALHOST}/analysis-info/full`;
  const config = { 
    headers: { Authorization: 'Bearer ' + accessToken } 
  };
  try {
    const response = await axios.get(endpoint, config);
    const { analysisFull } = response.data;
    const responseInfo = {
      method,
      status: response.status,
      message: "관상 분석을 로드했습니다.",
      analysisFull
    }
    // console.log(responseInfo);
    return responseInfo;
  }
  catch (error) {
    return handleError(error, method);
  }
}

// 22.
export const getAnalysisInfoShort = async (accessToken: string): Promise<analysisResponse | errorResponse> => {
  const method = "getAnalysisInfoShort";
  const endpoint =  `${LOCALHOST}/analysis-info/short`;
  const config = { 
    headers: { Authorization: 'Bearer ' + accessToken } 
  };
  try {
    const response = await axios.get(endpoint, config);
    const { analysisShort } = response.data;
    const responseInfo = {
      method,
      status: response.status,
      message: "관상 분석을 로드했습니다.",
      analysisShort
    }
    console.log(responseInfo);
    return responseInfo;
  }
  catch (error) {
    return handleError(error, method);
  }
}

export interface resumeResponse extends validResponse {
  resumeId: number,
  memberId: number,
  resumeImageS3urls: string[],
  faceInfo: {
    id: number
  } & faceInfoResponse,
  basicInfo: {
    id: number
  } & basicInfoResponse,
  analysisInfo: {
    id: number, 
    faceShapeIdNum: number,
  } & analysisResponse,
  categories: string[],
  content: string,
  isMine: boolean
}

export const convertURLtoFile = async (url: string) => {
  const response = await fetch(url);
  const blob = await response.blob();
  const reader = new FileReader();
  reader.onload = () => {
    const base64data = reader.result;
    return base64data;
  }
  reader.readAsDataURL(blob);
  // return file;
};

// 1.
export const postMyResume = async (accessToken: string): Promise<resumeResponse | errorResponse> => {
  const method = "postMyResume";
  const endpoint = `${LOCALHOST}/my-resume`;
  const config = { 
    headers: { 
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'multipart/form-data',
    },
  };
  const formData = new FormData();

  formData.append('categories', Object.keys(categoryFormat));
  formData.append('content', '');

  try {
    const response = await axios.post(endpoint, formData, config);
    console.log(response);
    const { resumeId, resumeImageS3urls, faceInfo, basicInfo, analysisInfo, categories, content, isMine } = response.data;
    const responseInfo = {
      method,
      status: response.status,
      message: "자신의 자기소개서를 업로드했습니다.",
      resumeId,
      resumeImageS3urls,
      faceInfo, 
      basicInfo, 
      analysisInfo, 
      categories, 
      content,
      isMine
    }
    // console.log(responseInfo);
    return responseInfo;
  }
  catch (error) {
    return handleError(error, method);
  }
}

// 2.
export const getOtherResume = async (accessToken: string, resumeId: number): Promise<resumeResponse | errorResponse> => {
  const method = "getResume";
  const endpoint = `${LOCALHOST}/resume?resumeId=${resumeId}`;
  const config = { 
    headers: { Authorization: 'Bearer ' + accessToken }
  };

  try {
    const response = await axios.get(endpoint, config);
    const { resumeId, resumeImageS3urls, faceInfo, basicInfo, analysisInfo, categories, content, isMine } = response.data;
    const responseInfo = {
      method,
      status: response.status,
      message: "타유저의 자기소개서를 로딩했습니다.",
      resumeId,
      resumeImageS3urls,
      faceInfo, 
      basicInfo, 
      analysisInfo, 
      categories, 
      content,
      isMine
    }
    // console.log(responseInfo);
    return responseInfo;
  }
  catch (error) {
    return handleError(error, method);
  }
}

// 2.
export const getOtherResumeBySenderId = async (accessToken: string, senderId: number): Promise<resumeResponse | errorResponse> => {
  const method = "getOtherResumeBySenderId";
  const endpoint = `${LOCALHOST}/sender-resume?senderId=${senderId}`;
  const config = { 
    headers: { Authorization: 'Bearer ' + accessToken }
  };

  try {
    const response = await axios.get(endpoint, config);
    const { resumeId, resumeImageS3urls, faceInfo, basicInfo, analysisInfo, categories, content, isMine } = response.data;
    const responseInfo = {
      method,
      status: response.status,
      message: "타유저의 자기소개서를 로딩했습니다.",
      resumeId,
      resumeImageS3urls,
      faceInfo, 
      basicInfo, 
      analysisInfo, 
      categories, 
      content,
      isMine
    }
    // console.log(responseInfo);
    return responseInfo;
  }
  catch (error) {
    return handleError(error, method);
  }
}

// 3.
export const getMyResume = async (accessToken: string): Promise<resumeResponse | errorResponse> => {
  const method = "getMyResume";
  const endpoint = `${LOCALHOST}/my-resume`;
  const config = { 
    headers: { 
      Authorization: 'Bearer ' + accessToken
    }
  };

  try {
    const response = await axios.get(endpoint, config);
    const { resumeId, memberId, resumeImageS3urls, faceInfo, basicInfo, analysisInfo, categories, content, isMine } = response.data;
    const responseInfo = {
      method,
      status: response.status,
      message: "자신의 자기소개서를 로딩했습니다.",
      resumeId,
      memberId, 
      resumeImageS3urls,
      faceInfo, 
      basicInfo, 
      analysisInfo, 
      categories, 
      content,
      isMine
    }
    // console.log(responseInfo);
    return responseInfo;
  }
  catch (error) {
    return handleError(error, method);
  }
}

// 4.
export const putResume = async (accessToken: string, fileUris: string[], _category: string[], _content: string): Promise<resumeResponse | errorResponse> => {
  const method = "putResume";
  const endpoint = `${LOCALHOST}/my-resume`;
  const config = { 
    headers: { 
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'multipart/form-data',
    },
  };
  const formData = new FormData();

  formData.append('categories', _category);
  formData.append('content', _content);

  for (const [index, fileUri] of fileUris.entries()) {
    // 파일의 확장자를 추출
    const extension = fileUri.split('.').pop()?.toLowerCase();
    // 파일(이미지)의 타입을 결정
    const mimeType = getMimeTypeFromExtension(extension);

    formData.append(`images`, {
      uri: fileUri,
      name: `file.${extension}`,
      type: mimeType,
    });
  };

  try {
    const response = await axios.put(endpoint, formData, config);
    // console.log("response", response);
    const { resumeId, memberId, resumeImageS3urls, faceInfo, basicInfo, analysisInfo, categories, content } = response.data;
    const responseInfo = {
      method,
      status: response.status,
      message: "자신의 자기소개서를 수정했습니다.",
      resumeId,
      memberId, 
      resumeImageS3urls,
      faceInfo, 
      basicInfo, 
      analysisInfo, 
      categories, 
      content,
    }
    return responseInfo;
  }
  catch (error) {
    return handleError(error, method);
  }
}

// 5.
export const deleteMyResume = async (accessToken: string): Promise<validResponse | errorResponse> => {
  const method = "deleteResume";
  const endpoint = `${LOCALHOST}/my-resume`;
  const config = { 
    headers: { Authorization: 'Bearer ' + accessToken}
  };

  try {
    const response = await axios.delete(endpoint, config);
    const { message } = response.data;
    const responseInfo = {
      method,
      status: response.status,
      message: message,
    }
    // console.log(responseInfo);
    return responseInfo;
  }
  catch (error) {
    return handleError(error, method);
  }
}

// 노션에 있는 형태와 좀 다릅니다. 노션에 있는 건 안 쓰는 key도 많고, 중복도 있는 것 같아, 쓸 것 같은 key만 일단 넣었습니다. 
export interface resumesResponse extends validResponse {
  number: number, // 현재 페이지
  totalPages: number, // 전체 페이지
  totalElements: number, // 총 객체 갯수
  size: number, // 한 페이지에 들어간 객체의 갯수
  first: boolean,
  last: boolean,
  content: [ 
    {
      resumeId: number,
      thumbnailS3url: string
    }
  ],
  pageable: {
    offset: number, // 건너 뛴 객체의 갯수(page * size)
    pageNumber: number, // 현재 페이지
    pageSize: number // 한 페이지에 들어간 객체의 갯수
  },
}

// 6.
export const getGoodCombi = async (accessToken: string, page: number, size: number): Promise<resumeResponse | errorResponse> => {
  const method = "getGoodCombi";
  const endpoint = `${LOCALHOST}/resume-by-good-combi?page=${page}&size=${size}`;
  const config = { 
    headers: { 
      Authorization: 'Bearer ' + accessToken
    }
  };

  try {
    const response = await axios.get(endpoint, config);
    const { pageable, totalPages, content, last } = response.data;
    const responseInfo = {
      method,
      status: response.status,
      message: "잘 맞는 궁합 유저를 로딩했습니다.",
      pageNumber: pageable.pageNumber,
      totalPages,
      pageSize: pageable.pageSize,
      content, 
      offset: pageable.offset,
      last,
    }
    // console.log(responseInfo);
    return responseInfo;
  }
  catch (error) {
    return handleError(error, method);
  }
}

// 7.
export const getCategoryUser = async (accessToken: string, page: number, size: number, category: string): Promise<resumeResponse | errorResponse> => {
  const method = "getGoodCombi";
  const endpoint = `${LOCALHOST}/resume-by-category?page=${page}&size=${size}&category=${category}`;
  const config = { 
    headers: { 
      Authorization: 'Bearer ' + accessToken
    }
  };

  try {
    const response = await axios.get(endpoint, config);
    const { pageable, totalPages, content, last } = response.data;
    const responseInfo = {
      method,
      status: response.status,
      message: `${category} 카테고리의 유저를 로딩했습니다.`,
      pageNumber: pageable.pageNumber,
      totalPages,
      pageSize: pageable.pageSize,
      content, 
      offset: pageable.offset,
      last,
    }
    // console.log(responseInfo);
    return responseInfo;
  }
  catch (error) {
    return handleError(error, method);
  }
}

export const isValidResponse = (response: validResponse | errorResponse): response is validResponse => {
  const validStatus = [200, 201, 202, 203, 204, 205, 206];
  return validStatus.includes(response.status)
}

export const isErrorResponse = (response: validResponse | errorResponse): response is errorResponse => {
  return (response as errorResponse).exceptionCode !== undefined;
}

export const isFindEmailResponse = (response: validResponse | errorResponse): response is findEmailResponse => {
  return (response as findEmailResponse).receivedEmail !== undefined;
}

export const isBasicInfoResponse = (response: validResponse | errorResponse): response is basicInfoResponse => {
  return (response as basicInfoResponse).nickname !== undefined;
}

export const isFaceInfoResponse = (response: validResponse | errorResponse): response is faceInfoResponse => {
  return (response as faceInfoResponse).generatedS3url !== undefined;
}

export const isFaceInfoDefaultResponse = (response: validResponse | errorResponse): response is faceInfoResponse => {
  return (response as faceInfoResponse).generatedS3url === (response as faceInfoResponse).originS3url;
}

export const isAnalysisInfoResponse = (response: validResponse | errorResponse): response is analysisResponse => {
  return isAnalysisFullResponse(response) && isAnalysisShortResponse(response);
}

export const isAnalysisFullResponse = (response: validResponse | errorResponse): response is analysisResponse => {
  return (response as analysisResponse).analysisFull !== undefined;
}

export const isAnalysisShortResponse = (response: validResponse | errorResponse): response is analysisResponse => {
  return (response as analysisResponse).analysisShort[0] !== "관상 분석 태그가 없습니다!";
}

export const isResumeResponse = (response: validResponse | errorResponse): response is resumeResponse => {
  return (response as resumeResponse).resumeId !== undefined;
}

export const isResumesResponse = (response: validResponse | errorResponse): response is resumesResponse => {
  return (response as resumesResponse).content !== undefined;
}