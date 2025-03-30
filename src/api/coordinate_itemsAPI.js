import apiClient, { API_BASE_URL } from "./client";

/**
 * 使用したアイテムの取得処理
 */
export const getCoordinateItems = async (id) => {
    const access_token = localStorage.getItem('access_token');
    try {
        const response = await fetch(`${API_BASE_URL}/coordinate_items/${id}`, {
            headers: { Authorization: `Bearer ${access_token}` }, // トークンをヘッダーに追加
        });
        if (!response.ok) throw new Error('アイテムの取得に失敗しました'); // エラーハンドリング
        const coordinateData = await response.json();

        // 各coordinate_itemのitem_idに対して個別にアイテムを取得
        const itemPromises = coordinateData.map(async (coordinate) => {
            try {
                const itemResponse = await fetch(`${API_BASE_URL}/items/${coordinate.item_id}`, {
                    headers: { Authorization: `Bearer ${access_token}` },
                });
                if (!itemResponse.ok) throw new Error(`アイテム(ID: ${coordinate.item_id})の取得に失敗しました`);
                return await itemResponse.json();
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
        alert('コーディネートが作成されました！ホームから確認できます');
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
    const access_token = localStorage.getItem('access_token');
    try {
        const response = await fetch(`${API_BASE_URL}/coordinate_items/${id}`, {
            method: 'DELETE', // HTTPメソッド
            headers: { Authorization: `Bearer ${access_token}` }, // トークンをヘッダーに追加
        });
        if (!response.ok) throw new Error('アイテムの削除に失敗しました'); // エラーハンドリング
    } catch (err) {
        return err;
    }
}