import axios from 'axios';

// ベースURLの設定（環境変数を優先して使用）
// const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';
const API_BASE_URL = 'http://localhost:8000';

// Axiosインスタンスを作成
const apiClient = axios.create({
    baseURL: API_BASE_URL, // ベースURLの設定
    headers: {
        'Content-Type': 'application/json', // リクエストをJSON形式に設定
    },
});

// リクエスト時にトークンを自動的にヘッダーへ追加
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); // ローカルストレージからトークンを取得
    if (token) {
        config.headers.Authorization = `Bearer ${token}`; // トークンを認証ヘッダーに設定
    }
    return config;
});

export default apiClient;