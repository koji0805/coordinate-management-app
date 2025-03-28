import { CustomForm, InputText, Textarea } from "./FormParts";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { FaImage } from "react-icons/fa";
import apiClient from "../api/client";
import Button from "./Button";
import ErrorText from "./ErrorText";
import Datepicker from "react-tailwindcss-datepicker";

export default function ItemForm({ mode }) {
    const today = useMemo(() => new Date().toISOString(), []);

    // フォームデータの状態管理
    const [formCoordData, setCoordFormData] = useState({
        name: '',
        memo: '',
    });

    const [formCoodItemData, setFormCoodItemData] = useState({
        items: [],
        day: today,
    })

    const { id } = useParams(); // URLの:idを取得
    // アイテム全体の状態管理
    const [items, setItems] = useState([]);
    const [itemsError, setItemsError] = useState('');

    const [checkedItems, setCheckedItems] = useState([]);

    useEffect(() => {
        setFormCoodItemData(prevData => ({
            ...prevData,
            items: checkedItems
        }));
    }, [checkedItems]);

    const handleCheckboxChange = (itemId) => {
        setCheckedItems((prev) =>
            prev.includes(itemId)
                ? prev.filter((id) => id !== itemId)
                : [...prev, itemId]
        );
    };

    // const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000'; // バックエンドAPIのベースURL
    const API_BASE_URL = 'http://localhost:8000'; // バックエンドAPIのベースURL
    const token = localStorage.getItem('token'); // ログイン時に保存したトークンを取得

    /**
     * コーディネートの取得処理
     */
    const fetchCoordinate = useCallback(async () => {
        if (mode === "edit") {
            try {
                const response_coordinates = await fetch(`${API_BASE_URL}/coordinates/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }, // トークンをヘッダーに追加
                });
                if (!response_coordinates.ok) throw new Error('アイテムの取得に失敗しました'); // エラーハンドリング
                const data_coordinates = await response_coordinates.json(); // JSON形式のデータを取得
                setCoordFormData(data_coordinates); // アイテム一覧を更新
                const response_coordinateItems = await fetch(`${API_BASE_URL}/coordinate_items/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }, // トークンをヘッダーに追加
                });
                if (!response_coordinateItems.ok) throw new Error('アイテムの取得に失敗しました'); // エラーハンドリング
                const data_coordinateItems = await response_coordinateItems.json(); // JSON形式のデータを取得
                const data_day = data_coordinateItems[0].day || today;
                const item_list = data_coordinateItems.map((item) => item.item_id);
                setFormCoodItemData(prevData => ({
                    ...prevData,
                    "items": item_list,
                    "day": data_day
                }));

                setCheckedItems(item_list);

            } catch (err) {
                // setItemError(err.message); // エラー内容を状態にセット
            }
        }
    }, [mode, id, token, today]);

    /**
     * アイテムの取得処理
     */
    const fetchItems = useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/items`, {
                headers: { Authorization: `Bearer ${token}` }, // トークンをヘッダーに追加
            });
            if (!response.ok) throw new Error('アイテムの取得に失敗しました'); // エラーハンドリング
            const data = await response.json(); // JSON形式のデータを取得
            setItems(data); // アイテム一覧を更新
        } catch (err) {
            setItemsError(err.message); // エラー内容を状態にセット
        }
    }, [API_BASE_URL, token]);

    /**
     * 初回レンダリング時にアイテム、コーディネートを取得
     */
    useEffect(() => {
        fetchItems();
        fetchCoordinate();
    }, [fetchCoordinate, fetchItems]);
    // バリデーションエラーの状態管理
    const [error, setError] = useState('');

    // ページ遷移用
    const navigate = useNavigate();

    // 入力フィールドの値を更新
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCoordFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    // フォーム送信時の処理
    const handleSubmit = async (e) => {
        e.preventDefault();
        const dayToUse = formCoodItemData.day || today;
        const payload = {
            coordinateItems: {
                day: dayToUse
            },
            used_items: formCoodItemData.items
        };
        try {
            if (mode === "new") {
                const response = await apiClient.post('/coordinates/', formCoordData); // バックエンドにアカウント作成リクエストを送信
                const newCodeId = response.data.id
                await apiClient.post(`/coordinate_items/?coordinate_id=${newCodeId}`, payload);
                alert('コーディネートが作成されました！ホームから確認できます');
            } else {
                await apiClient.put(('/coordinates/' + id), formCoordData); // バックエンドにアカウント修正リクエストを送信
                const response = await fetch(`${API_BASE_URL}/coordinate_items/${id}`, {
                    method: 'DELETE', // HTTPメソッド
                    headers: { Authorization: `Bearer ${token}` }, // トークンをヘッダーに追加
                });
                if (!response.ok || !response.ok) throw new Error('アイテムの削除に失敗しました'); // エラーハンドリング
                await apiClient.post(`/coordinate_items/?coordinate_id=${id}`, payload);
                alert('コーディネートが更新されました！ホームから確認できます');
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

    return (<>
        <CustomForm className="!mt-[20px]" onSubmit={handleSubmit}>
            <h2 className="text-[24px] font-bold mb-[16px]">{mode === "new" ? "作成" : "編集"}</h2>
            <small>名前</small>
            <InputText
                placeholder="お花見に来ていった"
                name="name"
                value={formCoordData.name}
                onChange={handleChange}
                required
            />
            <small>日付</small>
            <div className="mb-[28px] calendar-wrapper">
                <Datepicker
                    i18n={"ja"}
                    asSingle={true}
                    showShortcuts={true}
                    readOnly={true}
                    inputName="day"
                    placeholder="YYYY-MM-DD"
                    value={
                        formCoodItemData.day
                            ? { startDate: formCoodItemData.day, endDate: formCoodItemData.day }
                            : { startDate: today, endDate: today }
                    }
                    onChange={
                        (newValue) => {
                            setFormCoodItemData(prevData => ({
                                ...prevData,
                                "day": newValue.startDate
                            }));
                        }
                    }
                    inputClassName={"border-slate-200 border-[1px] border-solid p-[8px] w-full rounded-sm placeholder:text-slate-400 text-black cursor-pointer"}
                    popoverDirection="down"
                    startWeekOn="mon"
                    configs={{
                        shortcuts: {
                            today: "今日",
                            yesterday: "昨日",
                        }
                    }}
                />
            </div>
            <small>使用したアイテム</small>
            <div className="mb-[28px] flex flex-wrap">
                {itemsError && <ErrorText>{itemsError}</ErrorText>}
                {items.map((item) => (
                    <div className={"cursor-pointer border rounded-sm w-[120px] h-[100px] mr-[8px] nth-[3n]:mr-0 mb-[8px] p-[4px] hover:opacity-50 " + (checkedItems.includes(item.id) ? "bg-sky-600 text-slate-50" : "border-sky-600")} title={item.name} key={item.id}>
                        <label className="">
                            <input
                                type="checkbox"
                                name=" usedItem"
                                value={item.id}
                                className="hidden"
                                checked={checkedItems.includes(item.id)}
                                onChange={() => { handleCheckboxChange(item.id) }}
                            />
                            <p className="cursor-pointer p-[.5em] bg-slate-400 text-center text-slate-50">
                                <span className="text-[40px] inline-block">
                                    <FaImage />
                                </span>
                            </p>
                            <p className="cursor-pointer text-xs w-[100%] overflow-hidden overflow-ellipsis whitespace-nowrap mt-[4px]">{item.name}</p>
                        </label>
                    </div>
                ))}
            </div>
            <small>メモ</small>
            <div className="mb-[28px]">
                <Textarea
                    placeholder="田中さんと出かけたときに着た"
                    name="memo"
                    value={formCoordData.memo}
                    onChange={(e) => handleChange({
                        target: {
                            name: 'memo',
                            value: e.target.value
                        }
                    })}
                />
            </div>
            {error && <ErrorText>{error}</ErrorText>}
            <Button type="submit">登録する</Button>
        </CustomForm>
    </>);
}