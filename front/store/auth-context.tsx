import React, { createContext, useState, useEffect } from 'react';
import { removeRefreshToken, saveRefreshToken, loadRefreshToken } from '../util/encryptedStorage';
import axios, { AxiosError } from 'axios';
import Config from 'react-native-config';

const LOCALHOST = Config.LOCALHOST;

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  signin: (accessToken: string, refreshToken: string) => Promise<void>;
  signout: () => Promise<void>;
  reissue: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  signin: async (email: string, password: string) => {},
  signout: async () => {},
  reissue: async () => {},
});

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContextProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  // 10. OK
  const signin = async (email: string, password: string) => {
    const endpoint =  `${LOCALHOST}/auth/signin`;
    const body = {
      email,
      password,
    }

    try {
      const response = await axios.post(endpoint, body);
      const { accessToken, refreshToken } = response.data;
      console.log(accessToken, refreshToken);
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      saveRefreshToken(refreshToken);
    }
    catch (e) {
      const axiosError = e as AxiosError;
      if (axiosError.response && axiosError.response.status === 400) {
        console.log("이메일 또는 비밀번호가 잘못되었습니다.");
      }
      else console.log(e);
    }
  }

  // 11. OK
  const signout = async () => {
    const endpoint =  `${LOCALHOST}/members/signout`;
    const config = { 
      headers: { Authorization: 'Bearer ' + accessToken } 
    };
    try {
      const response = await axios.delete(endpoint, config);
      console.log(response.data);
      setAccessToken('');
      setRefreshToken('');
      removeRefreshToken();
    }
    catch (e) {
      console.log(e);
    }
  }

  // 12. OK
  const reissue = async () => {
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
    }
    catch (e) {
      console.log(e);
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
