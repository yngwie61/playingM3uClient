import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserManager, User } from 'oidc-client-ts';

// 認証コンテキストを作成
interface AuthContextType {
  idToken: string | undefined;
  accessToken: string | undefined;
  login: () => void;
  logout: () => void;
}

// OIDCの設定

const settings = {
  authority: 'http://127.0.0.1:5002',
  client_id: 'app1',
  redirect_uri: 'http://localhost:3000',
  response_type: 'code',
  scope: 'openid read',
  post_logout_redirect_uri: 'http://localhost:3000',
  loadUserInfo: false,
};

/*
const settings = {
  authority: 'http://127.0.0.1:8080/realms/master',
  client_id: 'testclient',
  redirect_uri: 'http://localhost:3000',
  response_type: 'code',
  scope: 'openid',
  post_logout_redirect_uri: 'http://localhost:3000',
  loadUserInfo: true,
};
*/

const userManager = new UserManager(settings);

// ログイン関数
export const login = () => {
  userManager.signinRedirect();
};

// ログアウト関数
export const logout = () => {
  userManager.signoutRedirect();
  //localStorage.removeItem('id_token');
  //localStorage.removeItem('access_token');
};

// 認証コールバック処理
export const handleCallback = async (): Promise<User | null> => {
  try {
    const user = await userManager.signinRedirectCallback();
    return user;
  } catch (error) {
    console.error('Error during callback processing:', error);
    return null;
  }
};

/*
const getStoredToken = (key: string): string | null => {
  return localStorage.getItem(key);
};

const setStoredToken = (key: string, token: string) => {
  localStorage.setItem(key, token);
};
*/

// AuthContextを作成
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProviderコンポーネント
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  //const [idToken, setIdToken] = useState<string | null>(() => getStoredToken('id_token'));
  //const [accessToken, setAccessToken] = useState<string | null>(() => getStoredToken('access_token'));
  const [idToken, setIdToken] = useState<string | undefined>();
  const [accessToken, setAccessToken] = useState<string | undefined>();


  // 認証コールバックの処理
  useEffect(() => {
    const processCallback = async () => {
      const authenticatedUser = await handleCallback();
      //console.log(authenticatedUser)
      if (authenticatedUser) {
        // setStoredToken('access_token', authenticatedUser.access_token ?? '');
        // setStoredToken('id_token', authenticatedUser.id_token ?? '');
        setIdToken(authenticatedUser.id_token ?? undefined);
        setAccessToken(authenticatedUser.access_token ?? undefined);
      }
    };

    processCallback()

  }, []);

  return (
    <AuthContext.Provider value={{ idToken, accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );

};

// AuthContextを使用するフック
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
