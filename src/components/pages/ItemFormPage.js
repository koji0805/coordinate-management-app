import { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { getItem, postItem, putItem } from "../../api/itemsAPI";
import { CustomForm, InputText, RadioButton, Textarea } from "../common/FormParts";
import Button from "../common/Button";
import ErrorText from "../common/ErrorText";
export default function ItemFormPage({ mode }) {
    // フォームデータの状態管理
    const [formData, setFormData] = useState({
        name: '',
        category: '着物',
        color: 'red-600',
        memo: '',
    });
    const { id } = useParams(); // URLの:idを取得
    const [itemError, setItemError] = useState('');

    /**
     * 初回レンダリング時にアイテムを取得
     */
    useEffect(() => {
        if (mode === "edit") {
            // 所持アイテム
            const fetchItems = async () => {
                try {
                    const data = await getItem(id);
                    setFormData(data);
                } catch (err) {
                    setItemError('該当アイテムの取得に失敗しました');
                }
            };
            fetchItems();
        }
    }, [id, mode]);

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
                await postItem(formData);
                alert('アイテムが作成されました！ホームから確認できます');
            } else {
                await putItem(id, formData)
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
    if (itemError) return <ErrorText>{itemError}</ErrorText>
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