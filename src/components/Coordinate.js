import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FaImage } from "react-icons/fa";
import Button, { GrayButton } from "./Button";
import { H3 } from "./Header";
import ItemListItem from "./ListItem";
import ErrorText from "./ErrorText";

export default function Coordinate() {
    const { id } = useParams(); // URLの:idを取得
    const [coorinate, setCoordinate] = useState('');
    const [coordinateItems, setCoordinateItems] = useState([]);
    const [items, setItems] = useState([]);
    const [coorinateError, setCoordinateError] = useState('');
    const [coorinateItemsError, setCoordinateItemsError] = useState('');
    const [itemError, setItemError] = useState('');
    const [deleteError, setDeleteError] = useState('');
    // const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000'; // バックエンドAPIのベースURL
    const API_BASE_URL = 'http://localhost:8000'; // バックエンドAPIのベースURL
    const token = localStorage.getItem('token'); // ログイン時に保存したトークンを取得
    const [isEditMode, setIsEditMode] = useState(false);
    // ページ遷移用
    const navigate = useNavigate();

    /**
     * コーディネートの取得処理
     */
    const fetchCoordinate = useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/coordinates/${id}`, {
                headers: { Authorization: `Bearer ${token}` }, // トークンをヘッダーに追加
            });
            if (!response.ok) throw new Error('コーディネートの取得に失敗しました'); // エラーハンドリング
            const data = await response.json(); // JSON形式のデータを取得
            setCoordinate(data); // コーディネート一覧を更新
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
            if (!response.ok) throw new Error('アイテムの取得に失敗しました'); // エラーハンドリング
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
     * アイテム削除処理
     */
    const handleDeleteCoordinate = async () => {
        try {
            if (window.confirm(`${coorinate.name}を削除しますか？`)) {
                const response_coordinateItems = await fetch(`${API_BASE_URL}/coordinate_items/${coorinate.id}`, {
                    method: 'DELETE', // HTTPメソッド
                    headers: { Authorization: `Bearer ${token}` }, // トークンをヘッダーに追加
                });
                const response_coordinates = await fetch(`${API_BASE_URL}/coordinates/${coorinate.id}`, {
                    method: 'DELETE', // HTTPメソッド
                    headers: { Authorization: `Bearer ${token}` }, // トークンをヘッダーに追加
                });

                if (!response_coordinates.ok || !response_coordinateItems.ok) throw new Error('アイテムの削除に失敗しました'); // エラーハンドリング
                alert('アイテムが削除されました！ホーム画面を表示します');
                navigate('/home'); // ログイン画面に遷移
            } else {
                return
            }
        } catch (err) {
            setDeleteError(err.message); // エラー内容を状態にセット
        }
    };
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
                <H3>使用したアイテム</H3>
                <ul className="">
                    {
                        items.length > 0 ?
                            items.map((item) => {
                                return (
                                    <ItemListItem item={item} to={"/item/" + item.id} key={item.id} title={item.name} />
                                );
                            }) :
                            <p>使用したアイテムがありません。</p>
                    }
                </ul>
            </div>
            <div className="mt-[1.5em]">
                <Link to={"/coordinate/edit/" + id}>
                    <Button>編集する</Button>
                </Link>
                {deleteError && <ErrorText>{deleteError}</ErrorText>}
                <GrayButton onClick={handleDeleteCoordinate}>削除する</GrayButton>
            </div>
        </div>
    </>);
}