import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { FaImage } from "react-icons/fa";
import Datepicker from "react-tailwindcss-datepicker";
import { getCoordinate, postCoordinate, putCoordinate } from "../../api/coordinateAPI";
import { getCoordinateItems, postCoordinateItems, putCoordinateItems } from "../../api/coordinate_itemsAPI";
import { getAllItems } from "../../api/itemsAPI";
import { CustomForm, InputText, Textarea } from "../common/FormParts";
import Button from "../common/Button";
import ErrorText from "../common/ErrorText";

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
    const [coordinateError, setCoordinateError] = useState('')
    const [checkedItems, setCheckedItems] = useState([]);
    const [coordinateItemsError, setCoordinateItemsError] = useState('');

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

    // 初回レンダリング時に情報を取得
    useEffect(() => {
        if (mode === "edit") {
            const fetchCoordinate = async () => {
                try {
                    const data_coordinates = await getCoordinate(id);
                    setCoordFormData(data_coordinates);
                } catch (err) {
                    setCoordinateError('コーディネートの取得に失敗しました');
                }
            };
            fetchCoordinate();

            const fetchCoordinateItems = async () => {
                try {
                    const data_coordinateItems = await getCoordinateItems(id);
                    const data_day = (data_coordinateItems[0] ? data_coordinateItems[0].day : today)
                    const item_list = data_coordinateItems.map((item) => item.id);
                    setFormCoodItemData(prevData => ({
                        ...prevData,
                        "items": item_list,
                        "day": data_day
                    }));
                    setCheckedItems(item_list);
                } catch (err) {
                    setCoordinateItemsError('使用したアイテムの取得に失敗しました');
                }
            };
            fetchCoordinateItems();
        }

        // 所持アイテムを取得して更新
        const fetchAndSetItems = async () => {
            try {
                const data_items = await getAllItems();
                setItems(data_items);
            } catch (err) {
                setCoordinateError('所持しているアイテムの取得に失敗しました');
            }
        };
        fetchAndSetItems();
    }, [id, mode, today]);

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
        const formCoordItemsData = {
            coordinateItems: {
                day: dayToUse
            },
            used_items: formCoodItemData.items
        };
        try {
            if (mode === "new") {
                const newId = await postCoordinate(formCoordData);
                await postCoordinateItems(newId, formCoordItemsData);
            } else {
                await putCoordinate(id, formCoordData)
                await putCoordinateItems(id, formCoordItemsData)
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

    if (coordinateError) return <div>コーディネートエラー: {coordinateError.message}</div>;
    if (coordinateItemsError) return <div>使用アイテムエラー: {coordinateItemsError}</div>;
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