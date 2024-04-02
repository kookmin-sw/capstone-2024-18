import React, { createContext, useState, useEffect } from 'react';
import { removeRefreshToken, saveRefreshToken, loadRefreshToken } from '../util/encryptedStorage';
import axios from 'axios';
import Config from 'react-native-config';

import { validResponse, errorResponse, handleError } from '../util/auth';

const LOCALHOST = Config.LOCALHOST;

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
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
      saveRefreshToken(refreshToken);
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
      removeRefreshToken();
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
    try {
      const response = await axios.post(endpoint, body, config);
      const { newAccessToken, newRefreshToken } = response.data;
      setAccessToken(newAccessToken);
      setRefreshToken(newRefreshToken);
      saveRefreshToken(newRefreshToken);
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
      const storedRefreshToken = await loadRefreshToken();
      if (storedRefreshToken) {
        setRefreshToken(storedRefreshToken);
      }
    };
    loadInitialToken();
  }, []);

  const value = {
    accessToken,
    refreshToken,
    isAuthenticated: !!accessToken,
    signin,
    signout,
    reissue,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
