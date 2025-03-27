import { useEffect, useState, useCallback } from "react";
// import { useNavigate } from 'react-router-dom';
import List from "./List";
import ErrorText from "./ErrorText";
import Button from "./Button";
import ItemFilter, { categories } from "./ItemFliter";
import { Link } from "react-router-dom";

export const HomeForUser = ({ username }) => {
    // アイテム全体の状態管理
    const [items, setItems] = useState([]);
    // コーディネート全体の状態管理
    const [coordinates, setCoordinates] = useState([]);
    // エラーメッセージの管理
    const [coordinatesError, setCoordinatesError] = useState('');
    const [itemsError, setItemsError] = useState('');
    const [showType, setShowType] = useState('coordinate');
    const [itemFilter, setItemFilter] = useState('all');
    // フィルタリング状態の管理
    const [selectedCategory, setSelectedCategory] = useState("すべて");

    // const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000'; // バックエンドAPIのベースURL
    const API_BASE_URL = 'http://localhost:8000'; // バックエンドAPIのベースURL
    const token = localStorage.getItem('token'); // ログイン時に保存したトークンを取得

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
     * コーディネートの取得処理
     */
    const fetchCoordinates = useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/coordinates`, {
                headers: { Authorization: `Bearer ${token}` }, // トークンをヘッダーに追加
            });
            if (!response.ok) throw new Error('コーディネートの取得に失敗しました'); // エラーハンドリング
            const data = await response.json(); // JSON形式のデータを取得
            setCoordinates(data); // 一覧を更新
        } catch (err) {
            setCoordinatesError(err.message); // エラー内容を状態にセット
        }
    }, [API_BASE_URL, token]);

    /**
     * 初回レンダリング時にアイテム、コーディネートを取得
     */
    useEffect(() => {
        fetchItems();
        fetchCoordinates();
    }, [fetchItems, fetchCoordinates]);

    useEffect(() => {
    }, [selectedCategory]);

    const handleShowType = (mode) => {
        mode === "coordinate" ? setShowType("coordinate") : setShowType("item")
    }

    /**
     * フィルタリング状態に応じたアイテムリストを取得
     */
    const filteredItems = items.filter((item) => {
        if (selectedCategory === "すべて") {
            return true;
        }
        return item.category === selectedCategory;
    });

    return (
        <div className="p-[1em] max-w-[calc(900px_+_4em)] m-auto">
            <h2 className="text-[24px] font-bold">{username}</h2>
            <div className="sections">
                <ul className="flex">
                    <li className={
                        "py-[4px] px-[8px] mb-[-2px] cursor-pointer rounded-sm mr-[.5em]"
                        + (showType === "coordinate" ? " border-[2px] border-sky-600 bg-white border-b-white" : " bg-sky-600 text-white hover:opacity-50 pt-[6px]")
                    } onClick={() => { return handleShowType("coordinate") }}>コーディネート</li>
                    <li className={
                        "py-[4px] px-[8px] mb-[-2px] cursor-pointer rounded-sm"
                        + (showType === "item" ? " border-[2px] border-sky-600 bg-white border-b-white" : " bg-sky-600 text-white hover:opacity-50 pt-[6px]")
                    } onClick={() => { return handleShowType("item") }}>アイテム</li>
                </ul>
                <section className="pt-[1em] border-t-[2px] border-sky-600 max-h-[calc(100vh_-_15em)] overflow-y-auto min-h-[5em]">
                    {
                        showType === "coordinate" ?
                            <>
                                {coordinatesError && <ErrorText>{coordinatesError}</ErrorText>}
                                <List items={coordinates} directory="/coordinate/" date="YYYYMMDD" />
                            </>
                            :
                            <>
                                <div>
                                    <span>カテゴリー：</span>
                                    {/* フィルタリングボタン */}
                                    <ItemFilter selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
                                </div>
                                {itemsError && <ErrorText>{itemsError}</ErrorText>}
                                <List items={filteredItems} directory="/item/" />
                            </>
                    }
                </section>
            </div>

            <footer className="fixed bottom-[1em] block w-[calc(100%_-_4em)] max-w-[calc(900px_+_4em)] m-auto text-right">
                <Link to={"/" + showType + "/new"}>
                    <Button>登録する</Button>
                </Link>
            </footer>
        </div>
    );
}

export const HomeForGuest = () => {
    return (
        <div className="p-[1em]">
            <p>ゲスト用TOP</p>
        </div>
    );
}