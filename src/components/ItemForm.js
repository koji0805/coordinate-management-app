import { CustomForm, InputText, RadioButton, Textarea } from "./FormParts";
import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import Button from "./Button";
import apiClient from "../api/client";
export default function ItemForm({ mode }) {
    // フォームデータの状態管理
    const [formData, setFormData] = useState({
        name: '',
        category: '着物',
        color: 'red-600',
        memo: '',
    });
    const { id } = useParams(); // URLの:idを取得

    // const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000'; // バックエンドAPIのベースURL
    const API_BASE_URL = 'http://localhost:8000'; // バックエンドAPIのベースURL
    const token = localStorage.getItem('token'); // ログイン時に保存したトークンを取得
    /**
     * アイテムの取得処理
     */
    const fetchItems = useCallback(async () => {
        if (mode === "edit") {
            try {
                const response = await fetch(`${API_BASE_URL}/items/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }, // トークンをヘッダーに追加
                });
                if (!response.ok) throw new Error('アイテムの取得に失敗しました'); // エラーハンドリング
                const data = await response.json(); // JSON形式のデータを取得
                setFormData(data); // アイテム一覧を更新
            } catch (err) {
                // setItemError(err.message); // エラー内容を状態にセット
            }
        }
    }, [API_BASE_URL, token, id, mode]);

    /**
     * 初回レンダリング時にアイテム、コーディネートを取得
     */
    useEffect(() => {
        fetchItems();
    }, [fetchItems]);
    // バリデーションエラーの状態管理
    const [error, setError] = useState('');

    // ページ遷移用
    const navigate = useNavigate();

    // 入力フィールドの値を更新
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    // フォーム送信時の処理
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (mode === "new") {
                await apiClient.post('/items', formData); // バックエンドにアカウント作成リクエストを送信
                alert('アイテムが作成されました！ホームから確認できます');
            } else {
                await apiClient.put(('/items/' + id), formData); // バックエンドにアカウント作成リクエストを送信
                alert('アイテムが更新されました！ホームから確認できます');
            }
            navigate('/home'); // ログイン画面に遷移
        } catch (err) {
            // エラーメッセージを取得
            if (err.response && err.response.data) {
                // エラーがオブジェクトの場合、文字列に変換する
                if (typeof err.response.data.detail === 'object') {
                    // 検証エラーの場合、各エラーメッセージを連結
                    if (Array.isArray(err.response.data.detail)) {
                        setError(err.response.data.detail.map(e => e.msg).join(', '));
                    } else {
                        setError(JSON.stringify(err.response.data.detail));
                    }
                } else {
                    setError(err.response.data.detail || 'アイテム作成に失敗しました');
                }
            } else {
                setError('アイテム作成に失敗しました。入力内容を確認してください。');
            }
        }
    };
    const [selectedCategory, setSelectedCategory] = useState('obi');
    const [selectedColor, setSelectedColor] = useState('red-600');

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    }
    const handleCategoryColor = (e) => {
        setSelectedColor(e.target.value);
    }

    const colorMap = {
        "red-600": "赤",
        "orange-400": "オレンジ",
        "yellow-300": "黄色",
        "green-600": "緑",
        "blue-600": "青",
        "purple-600": "紫",
        "cyan-200": "水色",
        "lime-200": "黄緑",
        "pink-400": "ピンク",
        "slate-400": "灰色",
        "slate-200": "シルバー",
        "[#e2d06e]": "ゴールド",
        "stone-950": "黒",
        "white": "白"
    };
    function getColorText(color) {
        return colorMap[color] || color;
    }
    return (<>
        <CustomForm className="!mt-[20px]" onSubmit={handleSubmit}>
            <h2 className="text-[24px] font-bold mb-[16px]">{mode === "new" ? "作成" : "編集"}</h2>
            <small>名前</small>
            <InputText
                placeholder="青色の無地小紋"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
            />
            <small>カテゴリー</small>
            <div className="mb-[28px]">
                {["着物", "帯", "羽織", "半襟", "帯揚げ", "帯締め", "帯留め", "その他"].map((category) => (
                    <RadioButton
                        key={category}
                        name="category"
                        btnCls="text-left"
                        text={category}
                        value={category}
                        onChange={handleChange}
                        checked={formData.category === category}
                    />
                ))}
            </div>
            <small>色</small>
            <div className="mb-[28px]">
                {Object.keys(colorMap).map((color) => (
                    <RadioButton
                        key={color}
                        name="color"
                        text={getColorText(color)}
                        value={color}
                        onChange={handleChange}
                        checked={formData.color === color}
                    />
                ))}
            </div>
            <small>メモ</small>
            <div className="mb-[28px]">
                <Textarea
                    placeholder="浅草で購入"
                    name="memo"
                    value={formData.memo}
                    onChange={(e) => handleChange({
                        target: {
                            name: 'memo',
                            value: e.target.value
                        }
                    })}
                />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <p className="bg-white bg-stone-950"></p>
            <Button type="submit">登録する</Button>
        </CustomForm>
    </>);
}