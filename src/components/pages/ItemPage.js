import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FaImage } from "react-icons/fa";
import { deleteItems, deleteItemfromCoordinates, getItem, getCoordinateByItem } from "../../api/itemsAPI";
import { H3 } from "../layout/Header";
import Button, { GrayButton } from "../common/Button";
import ItemListItem from "../list/ListItem";
import ErrorText from "../common/ErrorText";

export default function Items() {
    const { id } = useParams(); // URLの:idを取得
    const [item, setItem] = useState([]);
    const [itemError, setItemError] = useState('');
    const [coordinates, setCoordinates] = useState([]);
    const [coordinatesError, setCoordinatesrror] = useState('');
    const [deleteError, setDeleteError] = useState('');

    // ページ遷移用
    const navigate = useNavigate();

    // 所持アイテムを取得して更新
    const fetchAndSetItem = useCallback(async () => {
        try {
            const data_item = await getItem(id);
            setItem(data_item);
        } catch (err) {
            setItemError('アイテムの取得に失敗しました');
        }
    }, [id]);
    // 所持アイテムを取得して更新
    const fetchAndSetCoordinate = useCallback(async () => {
        try {
            const data_coordinate = await getCoordinateByItem(id);
            setCoordinates(data_coordinate);
        } catch (err) {
            setItemError('アイテムの取得に失敗しました');
        }
    }, [id]);
    // 
    useEffect(() => {
        fetchAndSetItem();
        fetchAndSetCoordinate();
    }, [fetchAndSetItem, fetchAndSetCoordinate]);

    const ColorMark = ({ color }) => {
        const colorClassName = "bg-" + color;
        return (
            <span className={"block w-[1em] h-[1em] rounded-[50%] absolute left-0 top-[50%] translate-y-[-50%] " + colorClassName}></span>
        )
    }

    const Dl = ({ dt, dd }) => {
        return (
            <dl className="flex">
                <dt className="w-[5em]">{dt}</dt>
                <dd className="flex-1">：{dd}</dd>
            </dl>
        );
    }

    /**
     * アイテム削除処理
     */
    const handleDeleteItem = async () => {
        if (window.confirm(`${item.name}を削除しますか？`)) {
            try {
                await deleteItemfromCoordinates(id);
                await deleteItems(id, item.name);
                alert('アイテムが削除されました！ホーム画面を表示します');
                navigate('/home');
            } catch (err) {
                setDeleteError(err.message); // エラー内容を状態にセット
            }
        }
    };

    if (itemError) return <div>エラー: {itemError.message}</div>;

    return (<>
        <div className="p-[1em] max-w-[calc(900px_+_4em)] m-auto">
            <p className="p-[.5em] bg-slate-400 text-center text-slate-50">
                <span className="text-[100px] inline-block">
                    <FaImage />
                </span>
            </p>
            <h2 className="text-[24px] font-bold relative pl-[1.25em]
            "><ColorMark color={item.color} />{item.name}</h2>
            <Dl dt="カテゴリー" dd={item.category}></Dl>
            <Dl dt="メモ" dd={item.memo}></Dl>

            <H3>使用したコーディネート</H3>
            {coordinatesError && <ErrorText>coordinatesError</ErrorText>}
            {coordinates.length > 0 ? (
                <ul className="flex flex-wrap">
                    {coordinates.map((coord) => (
                        <ItemListItem key={coord.id} item={coord.id} to={`/coordinate/${coord.id}`} title={coord.name} />
                    ))}
                </ul>
            ) : (
                <p>使用したコーディネートはありません</p>
            )}

            <footer className="fixed bottom-[1em] block w-[calc(100%_-_4em)] max-w-[calc(900px_+_4em)] m-auto text-right">
                <Link to={"/item/edit/" + id}>
                    <Button>編集する</Button>
                </Link>
                {deleteError && <ErrorText>{deleteError}</ErrorText>}
                <GrayButton onClick={handleDeleteItem}>削除する</GrayButton>
            </footer>
        </div>
    </>);
}