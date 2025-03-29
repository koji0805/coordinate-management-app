import apiClient, { API_BASE_URL } from "./client";

/**
 * コーディネート一覧の取得処理
 */
export const getAllCoordinate = async () => {
    try {
        const access_token = localStorage.getItem('access_token');
        const response = await fetch(`${API_BASE_URL}/coordinates`, {
            headers: { Authorization: `Bearer ${access_token}` }, // トークンをヘッダーに追加
        });
        if (!response.ok) throw new Error('コーディネート一覧の取得に失敗しました'); // エラーハンドリング
        const data = await response.json(); // JSON形式のデータを取得
        return data;
    } catch (err) {
        return err;
    }
}

/**
 * 指定したIDのコーディネートの取得処理
 */
export const getCoordinate = async (id) => {
    const access_token = localStorage.getItem('access_token');
    try {
        const response = await fetch(`${API_BASE_URL}/coordinates/${id}`, {
            headers: { Authorization: `Bearer ${access_token}` }, // トークンをヘッダーに追加
        });
        if (!response.ok) throw new Error('コーディネートの取得に失敗しました'); // エラーハンドリング
        const data = await response.json(); // JSON形式のデータを取得
        return data;
    } catch (err) {
        return err;
    }
};

/**
 * コーディネートの追加処理
 */
export const postCoordinate = async (data) => {

    try {
        const response = await apiClient.post('/coordinates/', data); // バックエンドにアカウント作成リクエストを送信
        const newId = response.data.id;
        return newId
    } catch (err) {
        return err;
    }
}

/**
 * コーディネートの更新処理
 */
export const putCoordinate = async (id, data) => {
    try {
        const response = await apiClient.put(`/coordinates/${id}`, data);
        if (!response.ok) throw new Error('コーディネートの更新に失敗しました'); // エラーハンドリング
    } catch (err) {
        return err
    }
}

/**
 * コーディネートの削除処理
 */
export const deleteCoordinate = async (id) => {
    const access_token = localStorage.getItem('access_token');
    try {
        const response = await fetch(`${API_BASE_URL}/coordinates/${id}`, {
            method: 'DELETE', // HTTPメソッド
            headers: { Authorization: `Bearer ${access_token}` }, // トークンをヘッダーに追加
        });

        if (!response.ok) throw new Error('指定されたIDのアイテムをコーディネートから削除できませんでした'); // エラーハンドリング
    } catch (err) {
        return err
    }
};
