import React, { createContext, useState, useEffect } from 'react';
import { removeRefreshToken, saveRefreshToken, loadRefreshToken } from '../util/encryptedStorage';

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  authenticate: (accessToken: string, refreshToken: string) => Promise<void>;
  deauthenticate: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  authenticate: async () => {},
  deauthenticate: async () => {},
});

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContextProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  const authenticate = async (newAccessToken: string, newRefreshToken: string) => {
    setAccessToken(newAccessToken);
    setRefreshToken(newRefreshToken);
    saveRefreshToken(newRefreshToken);
  };

  const deauthenticate = async () => {
    setAccessToken(null);
    setRefreshToken(null);
    removeRefreshToken();
  };

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
    authenticate,
    deauthenticate,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
