
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { UserManager, User, UserManagerSettings } from 'oidc-client-ts';
import { settings } from '../types';

// UserManager のインスタンス (アプリケーション全体で一つ)
const userManager = new UserManager(settings);

// --- コンテキストの型定義 ---
interface AuthContextType {
    user: User | null;          // 認証済みユーザー情報 (null なら未認証)
    isLoading: boolean;         // 認証状態を確認中か？
    error: Error | null;        // 認証プロセスでのエラー
    isAuthenticated: boolean;   // 認証済みかどうか (user と user.expired で判定)
    idToken: string | undefined; // 便宜上 ID トークンも提供
    accessToken: string | undefined; // 便宜上 Access トークンも提供
    login: () => Promise<void>; // ログイン処理開始
    logout: () => Promise<void>; // ログアウト処理開始
}

// --- コンテキストの作成 ---
// デフォルト値は未定義 (Provider 外での使用を防ぐ)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- AuthProvider コンポーネント ---
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true); // 初期状態は確認中
    const [error, setError] = useState<Error | null>(null);

    // --- oidc-client-ts イベントハンドラ ---
    // ユーザーがロードされた (ログイン成功、サイレントリニューアル成功など)
    const onUserLoaded = useCallback((loadedUser: User) => {
        console.log('User loaded:', loadedUser);
        setUser(loadedUser);
        setIsLoading(false);
        setError(null);
    }, []);

    // ユーザーがアンロードされた (ログアウト成功など)
    const onUserUnloaded = useCallback(() => {
        console.log('User unloaded');
        setUser(null);
        setIsLoading(false);
        setError(null);
    }, []);

    // サイレントリニューアルでエラーが発生
    const onSilentRenewError = useCallback((error: Error) => {
        console.error('Silent renew error:', error);
        setError(error);
        // エラーによってはログアウトさせるなどの処理が必要
        // setUser(null);
        setIsLoading(false);
    }, []);

    // Access Token の有効期限が切れた (自動更新が始まる前)
    const onAccessTokenExpired = useCallback(() => {
        console.log('Access token expired, attempting silent renew...');
        // 必要であればローディング表示などを出す
    }, []);


    // --- 副作用: 初期読み込みとイベントリスナー設定 ---
    useEffect(() => {
        let isMounted = true; // アンマウント後の状態更新を防ぐフラグ
        setIsLoading(true);

        // イベントリスナーを登録
        userManager.events.addUserLoaded(onUserLoaded);
        userManager.events.addUserUnloaded(onUserUnloaded);
        userManager.events.addSilentRenewError(onSilentRenewError);
        userManager.events.addAccessTokenExpired(onAccessTokenExpired);

        // 初期ユーザー情報を取得 (既にログイン済みかチェック)
        userManager.getUser().then((loadedUser) => {
            if (isMounted) {
                if (loadedUser && !loadedUser.expired) {
                    console.log('Initial user found:', loadedUser);
                    setUser(loadedUser);
                } else {
                    console.log('No initial user found or expired.');
                    setUser(null); // 期限切れの場合も null に
                }
                // ★ getUser 後に isLoading を false にする
                setIsLoading(false);
            }
        }).catch((err) => {
            if (isMounted) {
                console.error('Error getting initial user:', err);
                setError(err instanceof Error ? err : new Error('Failed to get initial user'));
                setIsLoading(false);
            }
        });

        // クリーンアップ関数: コンポーネントがアンマウントされたらリスナーを削除
        return () => {
            isMounted = false;
            console.log('Removing oidc event listeners');
            userManager.events.removeUserLoaded(onUserLoaded);
            userManager.events.removeUserUnloaded(onUserUnloaded);
            userManager.events.removeSilentRenewError(onSilentRenewError);
            userManager.events.removeAccessTokenExpired(onAccessTokenExpired);
        };
        // useCallback を使っているので、依存配列は空でOK (関数自体は再生成されない)
    }, [onUserLoaded, onUserUnloaded, onSilentRenewError, onAccessTokenExpired]);


    // --- ログイン・ログアウト関数 ---
    const login = useCallback(async () => {
        try {
            // ログインページへリダイレクト
            await userManager.signinRedirect();
        } catch (err) {
            console.error('Error starting signin redirect:', err);
            setError(err instanceof Error ? err : new Error('Login failed to start'));
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            // ログアウトページへリダイレクト
            await userManager.signoutRedirect();
        } catch (err) {
            console.error('Error starting signout redirect:', err);
            setError(err instanceof Error ? err : new Error('Logout failed to start'));
        }
    }, []);

    // --- コンテキストの値 ---
    // user や isLoading が変わった時だけ再計算されるように useMemo を使用
    const contextValue = useMemo(() => {
        const isAuthenticated = !!user && !user.expired;
        return {
            user,
            isLoading,
            error,
            isAuthenticated,
            idToken: user?.id_token,
            accessToken: user?.access_token,
            login,
            logout,
        };
    }, [user, isLoading, error, login, logout]);


    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

// --- useAuth カスタムフック ---
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};