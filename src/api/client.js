import axios from 'axios';

// ベースURLの設定（環境変数を優先して使用）
// export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000'; // バックエンドAPIのベースURL
const backendHost =
    window.location.hostname === "localhost"
        ? "http://localhost:8000"
        : "http://192.168.11.2:8000";

export const API_BASE_URL = backendHost;

// Axiosインスタンスを作成
const apiClient = axios.create({
    baseURL: API_BASE_URL, // ベースURLの設定
});

let isRefreshing = false;
let refreshPromise = null;

// リクエスト時にトークンを自動的にヘッダーへ追加
apiClient.interceptors.response.use(
    (response) => response, // 通常のレスポンスはそのまま通す
    async (error) => {
        const originalRequest = error.config;
        // トークンの有効期限切れによる401エラーの場合、リフレッシュトークンで再試行
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            localStorage.getItem('refresh_token')
        ) {
            originalRequest._retry = true;
            if (!isRefreshing) {
                const refresh_token = localStorage.getItem('refresh_token');
                refreshPromise = axios.post(`${API_BASE_URL}/auth/refresh`, null, {
                    headers: {
                        Authorization: `Bearer ${refresh_token}`,
                    },
                }).then((res) => {
                    const newAccessToken = res.data.access_token;
                    localStorage.setItem('access_token', newAccessToken);
                    isRefreshing = false;
                    return newAccessToken;
                }).catch((err) => {
                    isRefreshing = false;
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    throw err;
                });
            }

            isRefreshing = true;

            try {
                const newAccessToken = await refreshPromise;
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return apiClient(originalRequest);
            } catch (refreshError) {

                console.error("トークンのリフレッシュに失敗しました", refreshError);
                // 必要ならログアウト処理もここで
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                // window.location.href = '/login';
            }
        }

        return Promise.reject(error); // 他のエラーはそのまま
    }
);

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

export default apiClient;