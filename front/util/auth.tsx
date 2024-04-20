import axios from 'axios';
import RNFS from 'react-native-fs';
import Config from 'react-native-config';

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

export const handleError = (error: unknown, method: string): errorResponse => {
  let errorInfo;

  if (axios.isAxiosError(error)) {

    // 요청이 전송되었고, 서버는 2xx 외의 상태 코드로 응답했습니다.
    if (error.response) {
      const httpErrorCode = error.response.status;
      const errorDetails = error.response?.data ? { ...error.response.data } : {};  
      errorInfo = {
        method,
        status: httpErrorCode,
        ...errorDetails, // exceptionCode, message
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
  
  console.log(JSON.stringify(errorInfo));
  return errorInfo;
}

interface findEmailResponse extends validResponse {
  receivedEmail: string; 
  isRegistered: boolean; 
}

// 3. OK
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

// 4. OK
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

// 5. OK
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

// 6. OK
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

// 7. OK
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

// 8. OK
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

// 9. OK
export const signup = async (email: string, password: string, password2: string, isVerified: boolean): Promise<validResponse | errorResponse> => {
  const method = "signup";
  const endpoint =  `${LOCALHOST}/auth/signup`;
  const body = {
    email,
    password,
    password2,
    isVerified,
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
  const endpoint =  `${LOCALHOST}/members/basic-info`;
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
    console.log(responseInfo);
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
  const method = "getBasicInfo";
  const endpoint =  `${LOCALHOST}/members/basic-info`;
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
  originS3Url: string,
  generatedS3Url: string
}

// 14.
export const getFaceInfo = async (accessToken: string): Promise<faceInfoResponse | errorResponse> => {
  const method = "getFaceInfo";
  const endpoint =  `${LOCALHOST}/face-info`;
  const config = { 
    headers: { Authorization: 'Bearer ' + accessToken } 
  };
  try {
    const response = await axios.get(endpoint, config);
    const { originS3Url, generatedS3Url } = response.data;
    const responseInfo = {
      method,
      status: response.status,
      message: "관상 이미지를 로드했습니다.",
      originS3Url, 
      generatedS3Url
    }
    console.log(responseInfo);
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

// 15.
export const postFaceInfo = async (accessToken: string, fileUri: string, styleId: number): Promise<faceInfoResponse | errorResponse> => {
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

  const method = "postFaceInfo";
  const endpoint = `${LOCALHOST}/face-info?styleId=${styleId}`;
  const config = { 
    headers: { 
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'multipart/form-data',
    }
  };
  try {
    const response = await axios.post(endpoint, formData, config);
    const { originS3Url, generatedS3Url } = response.data;
    const responseInfo = {
      method,
      status: response.status,
      message: "관상 이미지를 저장했습니다.",
      originS3Url, 
      generatedS3Url
    }
    console.log(responseInfo);
    return responseInfo;
  }
  catch (error) {
    return handleError(error, method);
  }
}

// 16.
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
    const { originS3Url, generatedS3Url } = response.data;
    const responseInfo = {
      method,
      status: response.status,
      message: "관상 이미지를 수정했습니다.",
      originS3Url, 
      generatedS3Url
    }
    console.log(responseInfo);
    return responseInfo;
  }
  catch (error) {
    return handleError(error, method);
  }
}

export const isValidResponse = (response: validResponse | errorResponse): response is validResponse => {
  return (response as errorResponse).exceptionCode === undefined;
}

export const isErrorResponse = (response: validResponse | errorResponse): response is errorResponse => {
  return (response as errorResponse).exceptionCode !== undefined;
}

export const isBasicInfoResponse = (response: validResponse | errorResponse): response is basicInfoResponse => {
  return (response as basicInfoResponse).nickname !== undefined;
}

export const isFaceInfoResponse = (response: validResponse | errorResponse): response is faceInfoResponse => {
  return (response as faceInfoResponse).generatedS3Url !== undefined;
}

export const isFaceInfoDefaultResponse = (response: validResponse | errorResponse): response is faceInfoResponse => {
  return (response as faceInfoResponse).generatedS3Url !== (response as faceInfoResponse).originS3Url;
}