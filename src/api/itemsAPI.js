import apiClient from "./client";

/**
 * アイテムの取得処理
 */
export const getAllItems = async () => {
    try {
        const response = await apiClient.get(`/items`);
        return response.data;
    } catch (err) {
        return err;
    }
};

/**
 * 指定したアイテムの取得処理
 */
export const getItem = async (id) => {
    try {
        const response = await apiClient.get(`/items/${id}`);
        return response.data;
    } catch (err) {
        return err;
    }
};

/**
 * アイテムの追加処理
 */
export const postItem = async (data) => {
    try {
        const response = await apiClient.post('/items', data);
        return response.data;
    } catch (err) {
        return err;
    }
};

/**
 * アイテムの追加処理
 */
export const putItem = async (id, data) => {
    try {
        const response = await apiClient.put((`/items/${id}`), data);
        return response.data;
    } catch (err) {
        return err;
    }
};

/**
 * アイテムの削除処理
 */
export const deleteItem = async (id) => {
    try {
        await apiClient.delete(`/items/${id}`);
        return true;
    } catch (err) {
        return err
    }
};

/**
 * 指定したアイテムを利用したコーディネートを取得
 */
export const getCoordinateByItem = async (id) => {
    try {
        const response = await apiClient.get(`/items/${id}/coordinates`);
        return response.data;
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
        return true;
    } catch (err) {
        return err
    }
};