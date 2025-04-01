import apiClient from "./client";

/**
 * 使用したアイテムの取得処理
 */
export const getCoordinateItems = async (id) => {
    try {
        const response = await apiClient.get(`/coordinate_items/${id}`);
        const coordinateData = response.data;

        // 各coordinate_itemのitem_idに対して個別にアイテムを取得
        const itemPromises = coordinateData.map(async (coordinate) => {
            try {
                const itemResponse = await apiClient.get(`/items/${coordinate.item_id}`);
                return await itemResponse.data;
            } catch (err) {
                return err;
            }
        });

        // 全てのアイテムを取得
        const itemResults = await Promise.all(itemPromises);
        return itemResults;
    } catch (err) {
        return err;
    }
};

/**
 * 使用したアイテムの追加処理
 */
export const postCoordinateItems = async (newId, coordinateItemsData) => {
    try {
        await apiClient.post(`/coordinate_items/?coordinate_id=${newId}`, coordinateItemsData);
    } catch (err) {
        return err;
    }
};

/**
 * 使用したアイテムの情報を更新処理
 */
export const putCoordinateItems = async (id, coordinateItemsData) => {
    try {
        await apiClient.put(`/coordinate_items/${id}`, coordinateItemsData);
    } catch (err) {
        return err;
    }
};

/**
 * 使用したアイテムの情報を削除
 */
export const deleteCoordinateItems = async (id) => {
    try {
        await apiClient.delete(`/coordinate_items/${id}`); // エラーハンドリング
        return true;
    } catch (err) {
        return err;
    }
}