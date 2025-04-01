import apiClient from "./client";

/**
 * コーディネート一覧の取得処理
 */
export const getAllCoordinate = async () => {
    try {
        const response = await apiClient.get(`/coordinates`);
        return response.data;
    } catch (err) {
        return err;
    }
}

/**
 * 指定したIDのコーディネートの取得処理
 */
export const getCoordinate = async (id) => {
    try {
        const response = await apiClient.get(`/coordinates/${id}`);
        return response.data;
    } catch (err) {
        return err;
    }
};

/**
 * コーディネートの追加処理
 */
export const postCoordinate = async (data) => {
    try {
        const response = await apiClient.post('/coordinates/', data);
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
        return response.data;
    } catch (err) {
        return err
    }
}

/**
 * コーディネートの削除処理
 */
export const deleteCoordinate = async (id) => {
    try {
        await apiClient.delete(`coordinates/${id}`);
        return true;
    } catch (err) {
        return err
    }
};
