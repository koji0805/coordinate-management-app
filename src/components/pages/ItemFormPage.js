import { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from "../../api/client";
import { getItem, postItem, putItem } from "../../api/itemsAPI";
import { postImage } from "../../api/imagesAPI";
import { CustomForm, InputText, RadioButton, Textarea, InputPhoto } from "../common/FormParts";
import Button from "../common/Button";
import ErrorText from "../common/ErrorText";
import { H2 } from "../layout/Header";
import { colorMap, getColorText } from "../../constants";
export default function ItemFormPage({ mode }) {
    const [isLoading, setIsLoading] = useState(true);

    // フォームデータの状態管理
    const [formData, setFormData] = useState({
        name: '',
        category: '着物',
        color: 'red-600',
        photo_url: '',
        memo: '',
    });
    const { id } = useParams(); // URLの:idを取得
    const [itemError, setItemError] = useState('');
    const [image, setImage] = useState(null);
    const [prevImageURL, setPrevImageURL] = useState(``);

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
                    if (data.photo_url) {
                        setPrevImageURL(`${API_BASE_URL}${data.photo_url}`);
                    }
                    setIsLoading(false);
                } catch (err) {
                    setItemError('該当アイテムの取得に失敗しました');
                }
            };
            fetchItems();
        } else {
            setPrevImageURL('');
            setIsLoading(false);
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
            const updatedData = { ...formData };

            if (image) {
                const formImage = new FormData();
                formImage.append("uploaded_file", image);
                try {
                    const imageResponse = await postImage(formImage);

                    if (imageResponse && imageResponse.photo_url) {
                        updatedData.photo_url = imageResponse.photo_url;
                    } else {
                        console.error("画像URLが返されませんでした");
                    }
                } catch (imageError) {
                    console.error("画像アップロードエラー:", imageError);
                    setError('画像のアップロードに失敗しました。画像サイズや形式を確認してください。');
                    return; // 画像アップロード失敗時は処理を中断
                }
            }
            if (mode === "new") {
                await postItem(updatedData);
                alert('アイテムが作成されました！ホームから確認できます');
            } else {
                await putItem(id, updatedData)
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

    if (itemError) return <ErrorText>{itemError}</ErrorText>
    return (<>
        <CustomForm className="!mt-[20px]" onSubmit={handleSubmit}>
            <H2>{mode === "new" ? "作成" : "編集"}</H2>
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
            <small>写真</small>
            <div className="mb-[28px]">
                {!isLoading && (
                    <InputPhoto onImageSelect={(file) => setImage(file)} prevPhoto={prevImageURL || ''} />
                )}
            </div>
            <small>メモ</small>
            <div className="mb-[28px] ">
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