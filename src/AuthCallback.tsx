// --- ★認証コールバック処理用コンポーネント (別ファイル推奨) ---
// このコンポーネントを /callback ルートに配置します (React Routerなどを使用)

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // react-router-dom v7 の場合
import { UserManager } from 'oidc-client-ts';
import { settings } from './types';


// AuthProvider で使ったものと同じ設定で UserManager を作成
// (設定を共通化する方法を検討してください)
const callbackUserManager = new UserManager(settings);

export const AuthCallback: React.FC = () => {
  const navigate = useNavigate(); // react-router v7 の場合

  useEffect(() => {
    callbackUserManager.signinRedirectCallback()
      .then((user) => {
        console.log('Callback successful, user:', user);
        // 認証後にリダイレクトさせたいパス (state に保存されていたものなど)
        // user.state にリダイレクト前のパスを保存しておくのが一般的
        const redirectTo = user?.state || '/';
        navigate(redirectTo, { replace: true });
      })
      .catch((error) => {
        console.error('Error processing callback:', error);
        // エラーページにリダイレクトするか、エラーメッセージを表示
        navigate('/login-error', { replace: true }); // 例
      });
  }, [navigate]);

  // コールバック処理中はローディング表示などを出す
  return <div>Processing login callback...</div>;
};


/*
function App() {
  // ルーターの設定 (例: react-router-dom)
  // <Routes>
  //   <Route path="/callback" element={<AuthCallback />} />
  //   <Route path="/" element={<MainApp />} />
  // </Routes>

  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}

function MainContent() {
  const { user, login, logout, isLoading, isAuthenticated, error } = useAuth();

  if (isLoading) {
    return <div>Loading authentication status...</div>;
  }

  if (error) {
    return <div>Authentication Error: {error.message}</div>;
  }

  return (
    <div>
      <h1>OIDC Authentication Example</h1>
      {isAuthenticated ? (
        <div>
          <p>Welcome, {user?.profile?.name || user?.profile?.sub}!</p>
          <p>ID Token: {user?.id_token?.substring(0, 30)}...</p>
          <button onClick={logout}>Logout</button>
          {/* 他の認証済みコンテンツ *}
        </div>
      ) : (
        <div>
          <p>You are not logged in.</p>
          <button onClick={login}>Login</button>
        </div>
      )}
    </div>
  );
}
*/