import React, { createContext, useState, useEffect, useMemo} from 'react';
import { removeToken, saveToken, loadToken } from '../util/encryptedStorage';
import axios from 'axios';
import Config from 'react-native-config';

import { validResponse, errorResponse, handleError, isValidResponse, isErrorResponse } from '../util/auth';
import { createAlertMessage } from '../util/alert';

const LOCALHOST = Config.LOCALHOST;

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  status: string;
  signin: (accessToken: string, refreshToken: string) => Promise<validResponse | errorResponse>;
  signout: () => Promise<validResponse | errorResponse>;
  reissue: () => Promise<validResponse | errorResponse>;
  reload: () => void;
  handleErrorResponse: (errorResponse: errorResponse) => void;
  userId: number,
}

const exampleResponse = {
  method: "",
  status: 0,
  message: "",
};

export const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  refreshToken: null,
  status: '',
  signin: async (email: string, password: string): Promise<validResponse | errorResponse> => exampleResponse,
  signout: async (): Promise<validResponse | errorResponse> => exampleResponse,
  reissue: async (): Promise<validResponse | errorResponse> => exampleResponse,
  reload: () => {},
  handleErrorResponse: (errorResponse: errorResponse) => {},
  userId: 0,
});

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContextProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [status, setStatus] = useState('');
  const [reloadCounter, setReloadCounter] = useState(0);
  const [userId, setUserId] = useState(0);

  const reload = () => {
    setReloadCounter(reloadCounter + 1);
  }

  // 8. OK
  const signin = async (email: string, password: string) => {
    const method = "signin";
    const endpoint =  `${LOCALHOST}/auth/signin`;
    const body = {
      email,
      password,
    }

    try {
      const response = await axios.post(endpoint, body);
      const { accessToken, refreshToken, memberId } = response.data;
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      setUserId(+memberId);
      saveToken("accessToken", accessToken);
      saveToken("refreshToken", refreshToken);
      setStatus('INITIALIZED');
      const responseInfo = {
        method,
        status: response.status,
        message: "로그인 되었습니다.",
        ...response.data,
      }
      console.log(response.data);
      console.log(`${method}: ${JSON.stringify(responseInfo)}`);
      return responseInfo;
    }
    catch (error) {
      return handleError(error, method);
    }
  }

  // 10. OK
  const signout = async (): Promise<validResponse | errorResponse>  => {
    const method = "signout";
    const endpoint =  `${LOCALHOST}/auth/signout`;
    const config = { 
      headers: { Authorization: 'Bearer ' + accessToken } 
    };
    try {
      const response = await axios.delete(endpoint, config);
      setAccessToken('');
      setRefreshToken('');
      setUserId(0);
      removeToken("accessToken");
      removeToken("refreshToken");
      const responseInfo = {
        method,
        status: response.status,
        message: "로그아웃 되었습니다.",
      }
      console.log(`${method}: ${JSON.stringify(responseInfo)}`);
      return responseInfo;
    }
    catch (error) {
      return handleError(error, method);
    }
  }

  // 11. OK
  const reissue = async (): Promise<validResponse | errorResponse>  => {
    const method = "reissue";
    const endpoint =  `${LOCALHOST}/auth/reissue`;
    const body = { refreshToken };
    const config = { 
      headers: { Authorization: 'Bearer ' + accessToken } 
    };
    try {
      const response = await axios.post(endpoint, body, config);
      const { accessToken, refreshToken } = response.data;
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      saveToken("accessToken", accessToken);
      saveToken("refreshToken", refreshToken);
      const responseInfo = {
        method,
        status: response.status,
        message: "액세스토큰을 재발급했습니다.",
        accessToken,
        refreshToken,
      }
      console.log(`${method}: ${JSON.stringify(responseInfo)}`);
      return responseInfo;
    }
    catch (error) {
      return handleError(error, method);
    }
  }

  // 로그아웃 후 Login 페이지로 이동
  const logoutAndRedirect = async () => {
    try {
      const response = await signout();
      if (isValidResponse(response)) {
        setStatus('NOT_EXIST');
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
      const response = await reissue();
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
          if (refreshToken) {
          // 엑세스토큰 재발급 시도
          console.log("재발급 시도");
          tryReissue();
        }
        else {
          console.log("리프레시 토큰 없음");
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
        createAlertMessage(response.message);
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

  useEffect(() => {
    const loadInitialToken = async () => {
      console.log("loadInitialToken 시작");
      const storedAccessToken = await loadToken("accessToken");
      const storedRefreshToken = await loadToken("refreshToken");
      if (storedAccessToken) {
        setAccessToken(storedAccessToken);
      }
      if (storedRefreshToken) {
        setRefreshToken(storedRefreshToken);
      }
      setStatus('LOADED'); 
      console.log("loadInitialToken 종료");
    };
    loadInitialToken();
  }, []);

  useEffect(() => {
    if (status !== 'LOADED') return;
    if (!accessToken) {
      setStatus('NOT_EXIST');
      return;
    }
    const reisseInitial = async () => {
      const response = await reissue();

      setStatus('INITIALIZED');
    }
    reisseInitial();
  }, [status])

  useEffect(() => {
    console.log(status);
  }, [status])

  const value = useMemo(() => ({
    accessToken,
    refreshToken,
    status,
    signin,
    signout,
    reissue,
    reload,
    handleErrorResponse,
    userId,
  }), [accessToken, refreshToken, status]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
