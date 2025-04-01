import { useEffect, useState, useCallback } from "react";
import List from "../list/List";
import ErrorText from "../common/ErrorText";
import Button from "../common/Button";
import { H2 } from "../layout/Header";
import ItemFilter from "../item/ItemFilter";
import { Link } from "react-router-dom";
import { getAllItems } from "../../api/itemsAPI";
import { getAllCoordinate } from "../../api/coordinateAPI";

export const HomeForUser = ({ username, type, setHomeType }) => {
    // アイテム全体の状態管理
    const [items, setItems] = useState([]);
    // コーディネート全体の状態管理
    const [coordinates, setCoordinates] = useState([]);
    // エラーメッセージの管理
    const [coordinatesError, setCoordinatesError] = useState('');
    const [itemsError, setItemsError] = useState('');
    const [showType, setShowType] = useState(type === "item" ? "item" : "coordinate");
    // フィルタリング状態の管理
    const [selectedCategory, setSelectedCategory] = useState("すべて");
    /**
     * アイテムの取得処理
     */
    const fetchAndSetItems = useCallback(async () => {
        try {
            const fetchItems = await getAllItems();
            setItems(fetchItems);
        } catch (err) {
            setItemsError('アイテムの取得に失敗しました。');
        }
    }, []);

    /**
     * コーディネートの取得処理
     */
    const fetchAndSetCoordinate = useCallback(async () => {
        try {
            const fetchCoordinates = await getAllCoordinate();
            setCoordinates(fetchCoordinates);
        } catch (err) {
            setCoordinatesError('コーディネート一覧の取得に失敗しました');
        }
    }, [])

    useEffect(() => {
        fetchAndSetItems();
        fetchAndSetCoordinate();
    }, [fetchAndSetItems, fetchAndSetCoordinate])

    useEffect(() => {
    }, [selectedCategory]);

    const handleShowType = (mode) => {
        if (mode === "coordinate") {
            setShowType("coordinate");
            setHomeType('coordinate');
        } else {
            setShowType("item")
            setHomeType("item")
        }
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
            <H2>{username}</H2>
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
                                <List items={coordinates} directory="/coordinate/" itemType="コーディネート" />
                            </>
                            :
                            <>
                                <div>
                                    <span>カテゴリー：</span>
                                    {/* フィルタリングボタン */}
                                    <ItemFilter selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
                                </div>
                                {itemsError && <ErrorText>{itemsError}</ErrorText>}
                                <List items={filteredItems} directory="/item/" itemType="アイテム" />
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
        <div className="text-center pt-[40px]">
            <div className="w-[100%] ">
                <img className="h-[18em] inline-block m-auto" src="/images/kimonoLady.png" alt="" />
            </div>
            <div className="">
                <p className="text-2xl font-bold mt-[16px]">コーディネートをメモする</p>
                <p className="mt-[1em]">着物のお出かけ記録や、<br />どのアイテムを使ったかをメモしておけます。</p>
                <p className="mt-[1em]">手持ちのアイテムを登録しておくことで、<br />コーディネートの振り返りがカンタンに！</p>
            </div>
        </div>
    );
}