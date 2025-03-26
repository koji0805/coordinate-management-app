import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { FaImage } from "react-icons/fa";
import Button, { GrayButton } from "./Button";

export default function Coordinate() {
    const { id } = useParams(); // URLの:idを取得
    const [coorinate, setCoordinate] = useState('');
    const [coordinateItems, setCoordinateItems] = useState([]);
    const [items, setItems] = useState([]);
    const [coorinateError, setCoordinateError] = useState('');
    const [coorinateItemsError, setCoordinateItemsError] = useState('');
    const [itemError, setItemError] = useState('');
    // const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000'; // バックエンドAPIのベースURL
    const API_BASE_URL = 'http://localhost:8000'; // バックエンドAPIのベースURL
    const token = localStorage.getItem('token'); // ログイン時に保存したトークンを取得
    const [isEditMode, setIsEditMode] = useState(false)

    /**
     * コーディネートの取得処理
     */
    const fetchCoordinate = useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/coordinates/${id}`, {
                headers: { Authorization: `Bearer ${token}` }, // トークンをヘッダーに追加
            });
            if (!response.ok) throw new Error('タスクの取得に失敗しました'); // エラーハンドリング
            const data = await response.json(); // JSON形式のデータを取得
            setCoordinate(data); // タスク一覧を更新
        } catch (err) {
            setCoordinateError(err.message); // エラー内容を状態にセット
        }
    }, [API_BASE_URL, token, id]);

    /**
     * アイテムの取得処理
     */
    const fetchCoordinateItems = useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/coordinate_items/${id}`, {
                headers: { Authorization: `Bearer ${token}` }, // トークンをヘッダーに追加
            });
            if (!response.ok) throw new Error('タスクの取得に失敗しました'); // エラーハンドリング
            const coordinateData = await response.json();
            setCoordinateItems(coordinateData);

            // 各coordinate_itemのitem_idに対して個別にアイテムを取得
            const itemPromises = coordinateData.map(async (coordinate) => {
                try {
                    const itemResponse = await fetch(`${API_BASE_URL}/items/${coordinate.item_id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    if (!itemResponse.ok) throw new Error(`アイテム(ID: ${coordinate.item_id})の取得に失敗しました`);
                    return await itemResponse.json();
                } catch (err) {
                    setItemError(err);
                    return null;
                }
            });

            // 全てのアイテムを取得
            const itemResults = await Promise.all(itemPromises);
            setItems(itemResults.filter(item => item !== null));
        } catch (err) {
            setCoordinateItemsError(err.message); // エラー内容を状態にセット
        }
    }, [API_BASE_URL, token, id]);

    /**
     * 初回レンダリング時にアイテム、コーディネートを取得
     */
    useEffect(() => {
        fetchCoordinate();
    }, [fetchCoordinate]);

    useEffect(() => {
        fetchCoordinateItems();
    }, [fetchCoordinateItems]);

    if (coorinateError) return <div>エラー: {coorinateError.message}</div>;
    if (coorinateItemsError) return <div>エラー: {coorinateItemsError.message}</div>;
    if (itemError) return <div>エラー: {itemError.message}</div>;

    const handleIsEditMode = () => {
        const nextMode = !isEditMode
        setIsEditMode(nextMode)
    }

    return (<>
        <div className="p-[1em] max-w-[calc(900px_+_4em)] m-auto">
            <p className="p-[.5em] bg-slate-400 text-center text-slate-50">
                <span className="text-[100px] inline-block">
                    <FaImage />
                </span>
            </p>
            <h2 className="text-[24px] font-bold">{coorinate.name}</h2>
            <p>{coorinate.memo}</p>
            <div className="mt-[.5em]">
                <h3 className="text-[20px]">使用したアイテム</h3>
                <ul className="">
                    {items.map((item) => {
                        return (
                            <li key={item.id} className="inline-block w-[300px] mr-[1em] mb-[.5em] [&:nth-child(3n)]:mr-0" >
                                <p className="p-[.5em] bg-slate-400 text-center text-slate-50">
                                    <span className="text-[100px] inline-block">
                                        <FaImage />
                                    </span>
                                </p>
                                {item.name}
                            </li>
                        );
                    })}
                </ul>
            </div>
            <div className="mt-[1.5em]">
                <Button>編集する</Button>
                <GrayButton>削除する</GrayButton>
            </div>
        </div>
    </>);
}