import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FaImage } from "react-icons/fa";
import { getCoordinate, deleteCoordinate } from "../../api/coordinateAPI";
import { getCoordinateItems, deleteCoordinateItems } from "../../api/coordinate_itemsAPI";
import Button, { GrayButton } from "../common/Button";
import { H3 } from "../layout/Header";
import ItemListItem from "../list/ListItem";
import ErrorText from "../common/ErrorText";

export default function Coordinate() {
    const { id } = useParams(); // URLの:idを取得
    const [deleteError, setDeleteError] = useState('');
    const [coordinate, setCoordinate] = useState('');
    const [coordinateError, setCoordinateError] = useState('');
    const [coordinateItems, setCoordinateItems] = useState([]);
    const [coordinateItemsError, setCoordinateItemsError] = useState('');

    const navigate = useNavigate();

    // 初回レンダリング時に情報を取得
    useEffect(() => {
        const fetchCoordinate = async () => {
            try {
                const data = await getCoordinate(id);
                setCoordinate(data);
            } catch (err) {
                setCoordinateError('コーディネートの取得に失敗しました');
            }
        };
        fetchCoordinate();

        const fetchCoordinateItems = async () => {
            try {
                const data = await getCoordinateItems(id);
                setCoordinateItems(data);
            } catch (err) {
                setCoordinateItemsError('使用したアイテムの取得に失敗しました');
            }
        };
        fetchCoordinateItems();
    }, [id]);

    const handleDelete = async () => {
        try {
            if (window.confirm(`${coordinate.name}を削除しますか？`)) {
                await deleteCoordinateItems(id);
                await deleteCoordinate(id);
                alert('アイテムが削除されました！ホーム画面を表示します');
                navigate('/home'); // 成功したら遷移
            }
        } catch (err) {
            setDeleteError('削除に失敗しました');
        }
    };

    if (coordinateError) return <div>エラー: {coordinateError.message}</div>;
    if (coordinateItemsError) return <div>エラー: {coordinateItemsError.message}</div>;

    return (<>
        <div className="p-[1em] max-w-[calc(900px_+_4em)] m-auto">
            <p className="p-[.5em] bg-slate-400 text-center text-slate-50">
                <span className="text-[100px] inline-block">
                    <FaImage />
                </span>
            </p>
            <h2 className="text-[24px] font-bold">{coordinate.name}</h2>
            <p>{coordinate.day ? coordinate.day.split('T')[0] : "日付が取得できませんでした"}</p>
            <div className="">
                <H3>使用したアイテム</H3>
                <ul className="">
                    {
                        coordinateItems.length > 0 ?
                            coordinateItems.map((item) => {
                                return (
                                    <ItemListItem item={item} to={"/item/" + item.id} key={item.id} title={item.name} />
                                );
                            }) :
                            <p>使用したアイテムがありません。</p>
                    }
                </ul>
            </div>
            <div className="mt-[.5em]">
                <H3>メモ</H3>
                <p>{coordinate.memo}</p>
            </div>
            <div className="mt-[1.5em]">
                <Link to={"/coordinate/edit/" + id}>
                    <Button>編集する</Button>
                </Link>
                {deleteError && <ErrorText>{deleteError}</ErrorText>}
                <GrayButton onClick={handleDelete}>削除する</GrayButton>
            </div>
        </div>
    </>);
}