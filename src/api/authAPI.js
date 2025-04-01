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

export const authMe = async () => {
    try {
        const response = await apiClient.get('/auth/me');
        return response.data
    } catch (error) {
        return ('ユーザー情報取得に失敗しました。');
    }
}

export const updateCurrentUser = async (data) => {
    await apiClient.put('/auth/me', data);
}