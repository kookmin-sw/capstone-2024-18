import React, { createContext, useState, useEffect, useMemo} from 'react';
import { removeToken, saveToken, loadToken } from '../util/encryptedStorage';
import axios from 'axios';
import Config from 'react-native-config';

import { validResponse, errorResponse, handleError } from '../util/auth';

const LOCALHOST = Config.LOCALHOST;

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signin: (accessToken: string, refreshToken: string) => Promise<validResponse | errorResponse>;
  signout: () => Promise<validResponse | errorResponse>;
  reissue: () => Promise<validResponse | errorResponse>;
}

const exampleResponse = {
  method: "",
  status: 0,
  message: "",
};

export const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  signin: async (email: string, password: string): Promise<validResponse | errorResponse> => exampleResponse,
  signout: async (): Promise<validResponse | errorResponse> => exampleResponse,
  reissue: async (): Promise<validResponse | errorResponse> => exampleResponse,
});

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContextProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 10. OK
  const signin = async (email: string, password: string) => {
    const method = "signin";
    const endpoint =  `${LOCALHOST}/auth/signin`;
    const body = {
      email,
      password,
    }

    try {
      const response = await axios.post(endpoint, body);
      const { accessToken, refreshToken } = response.data;
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      saveToken("accessToken", refreshToken);
      saveToken("refreshToken", refreshToken);
      const responseInfo = {
        method,
        status: response.status,
        message: "로그인 되었습니다.",
      }
      console.log(responseInfo);
      return responseInfo;
    }
    catch (error) {
      return handleError(error, method);
    }
  }

  // 11. OK
  const signout = async (): Promise<validResponse | errorResponse>  => {
    const method = "signout";
    const endpoint =  `${LOCALHOST}/members/signout`;
    const config = { 
      headers: { Authorization: 'Bearer ' + accessToken } 
    };
    try {
      const response = await axios.delete(endpoint, config);
      setAccessToken('');
      setRefreshToken('');
      removeToken("accessToken");
      removeToken("refreshToken");
      const responseInfo = {
        method,
        status: response.status,
        message: "로그아웃 되었습니다.",
      }
      console.log(responseInfo);
      return responseInfo;
    }
    catch (error) {
      return handleError(error, method);
    }
  }

  // 12. OK
  const reissue = async (): Promise<validResponse | errorResponse>  => {
    const method = "reissue";
    const endpoint =  `${LOCALHOST}/members/reissue`;
    const body = { refreshToken };
    const config = { 
      headers: { Authorization: 'Bearer ' + accessToken } 
    };
    console.log("accesstoken:"+accessToken);
    try {
      const response = await axios.post(endpoint, body, config);
      const { newAccessToken, newRefreshToken } = response.data;
      setAccessToken(newAccessToken);
      setRefreshToken(newRefreshToken);
      saveToken("accessToken", newAccessToken);
      saveToken("refreshToken", newRefreshToken);
      const responseInfo = {
        method,
        status: response.status,
        message: "액세스토큰을 재발급했습니다.",
      }
      console.log(responseInfo);
      return responseInfo;
    }
    catch (error) {
      return handleError(error, method);
    }
  }

  useEffect(() => {
    const loadInitialToken = async () => {
      console.log("토큰 로딩 시작");
      const storedAccessToken = await loadToken("accessToken");
      const storedRefreshToken = await loadToken("refreshToken");
      if (storedAccessToken) {
        setAccessToken(storedAccessToken);
        console.log("엑세스 토큰: ", storedAccessToken);
      }
      if (storedRefreshToken) {
        setRefreshToken(storedRefreshToken);
        console.log("리프레시 토큰: ", storedRefreshToken);
      }
      setIsLoading(false); 
      console.log("토큰 로딩 완료");
    };
    loadInitialToken();
  }, []);

  const value = useMemo(() => ({
    accessToken,
    refreshToken,
    isAuthenticated: !!accessToken,
    isLoading: isLoading, 
    signin,
    signout,
    reissue,
  }), [accessToken, refreshToken, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
