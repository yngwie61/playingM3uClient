import { UserManagerSettings } from 'oidc-client-ts';

// --- 設定 ---
// OIDC Provider の設定 (環境変数などから読み込むのが望ましい)
export const settings: UserManagerSettings = {
    authority: 'http://127.0.0.1:5002', // OIDC Provider の Authority URL
    client_id: 'app1',                 // OIDC Client ID
    redirect_uri: 'http://localhost:3000/callback', // ★認証コールバック用URL (専用ページを用意)
    response_type: 'code',            // PKCE を使う場合は 'code' (oidc-client-ts のデフォルト)
    scope: 'openid profile read',     // ★'profile' スコープも要求するとユーザー情報が取得しやすい
    post_logout_redirect_uri: 'http://localhost:3000', // ログアウト後のリダイレクト先
    // loadUserInfo: true,             // 必要に応じてユーザー情報を UserInfo エンドポイントから取得
    automaticSilentRenew: true,       // トークンの自動更新を試みる (推奨)
    // silent_redirect_uri: 'http://localhost:3000/silent-renew.html', // サイレントリニューアル用ページ (必要なら)
};