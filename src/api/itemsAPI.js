import apiClient, { API_BASE_URL } from "./client";

/**
 * アイテムの取得処理
 */
export const getAllItems = async () => {
    const access_token = localStorage.getItem('access_token');
    try {
        const response = await fetch(`${API_BASE_URL}/items`, {
            headers: { Authorization: `Bearer ${access_token}` }, // トークンをヘッダーに追加
        });
        if (!response.ok) throw new Error('アイテム一覧の取得に失敗しました'); // エラーハンドリング
        const data = await response.json(); // JSON形式のデータを取得
        return data;
    } catch (err) {
        return err;
    }
};

/**
 * 指定したアイテムの取得処理
 */
export const getItem = async (id) => {
    const access_token = localStorage.getItem('access_token');
    try {
        const response = await fetch(`${API_BASE_URL}/items/${id}`, {
            headers: { Authorization: `Bearer ${access_token}` }, // トークンをヘッダーに追加
        });
        if (!response.ok) throw new Error('アイテムの取得に失敗しました'); // エラーハンドリング
        const data = await response.json(); // JSON形式のデータを取得
        return data;
    } catch (err) {
        return err;
    }
};

/**
 * アイテムの追加処理
 */
export const postItem = async (data) => {
    try {
        await apiClient.post('/items', data); // バックエンドにアカウント作成リクエストを送信
    } catch (err) {
        return err;
    }
};

/**
 * アイテムの追加処理
 */
export const putItem = async (id, data) => {
    try {
        await apiClient.put((`/items/${id}`), data); // バックエンドにアカウント作成リクエストを送信
    } catch (err) {
        return err;
    }
};

/**
 * アイテムの削除処理
 */
export const deleteItems = async (id) => {
    const access_token = localStorage.getItem('access_token');
    try {
        const response = await fetch(`${API_BASE_URL}/items/${id}`, {
            method: 'DELETE', // HTTPメソッド
            headers: { Authorization: `Bearer ${access_token}` }, // トークンをヘッダーに追加
        });
        if (!response.ok) throw new Error('アイテムの削除に失敗しました'); // エラーハンドリング
    } catch (err) {
        return err
    }
};

/**
 * 指定したアイテムを利用したコーディネートを取得
 */
export const getCoordinateByItem = async (id) => {
    const access_token = localStorage.getItem('access_token');
    try {
        const response = await fetch(`${API_BASE_URL}/items/${id}/coordinates`, {
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
 * 指定したアイテムを利用したコーディネートから削除
 */
export const deleteItemfromCoordinates = async (id) => {
    try {
        await apiClient.delete(`/items/${id}/coordinates`);
    } catch (err) {
        return err
    }
};