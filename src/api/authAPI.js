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
    try {
        const response = await apiClient.get('/auth/me', {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });
        return response.data
    } catch (error) {
        const refresh_token = localStorage.getItem('refresh_token');
        const refresh_response = await apiClient.post('/auth/refresh', null, {
            headers: {
                Authorization: `Bearer ${refresh_token}`
            }
        })
        const newAccessToken = refresh_response.data.access_token;
        const retry_response = await apiClient.get('/auth/me', {
            headers: {
                Authorization: `Bearer ${newAccessToken}`
            }
        });
        localStorage.setItem('access_token', newAccessToken);
        return retry_response.data
    }

}