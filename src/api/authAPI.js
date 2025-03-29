import apiClient from './client';

export const login = async (email, password) => {
    try {
        const response = await apiClient.post('/auth/login', { email, password }); // ログインリクエスト
        return response;
    } catch {
        return ('ログインに失敗しました。ユーザー名またはパスワードを確認してください。');
    }
}

export const signup = async (data) => {
    await apiClient.post('/auth/signup', data); // バックエンドにアカウント作成リクエストを送信
}

export const authMe = async (access_token) => {
    const response = await apiClient.get('/auth/me', {
        headers: {
            Authorization: `Bearer ${access_token}`
        }
    });
    return response.data
}