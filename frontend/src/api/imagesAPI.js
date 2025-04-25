import apiClient from "./client";
export const postImage = async (formData) => {
    try {
        const response = await apiClient.post("/images", formData, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
                // ← ここで Content-Type は絶対に書かない！！
            },
        });
        return response.data;
    } catch (err) {
        console.error("画像アップロードエラー:", err.response ? err.response.data : err);
        throw err; // エラーを再スローして呼び出し元で処理できるようにする
    }
};