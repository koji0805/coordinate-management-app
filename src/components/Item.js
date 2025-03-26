import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaImage } from "react-icons/fa";
import { Link } from "react-router-dom";
import Button, { GrayButton } from "./Button";
import ErrorText from "./ErrorText";

export default function Items() {
    const { id } = useParams(); // URLの:idを取得
    const [item, setItem] = useState([]);
    const [itemError, setItemError] = useState('');
    const [deleteError, setDeleteError] = useState('');
    // const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000'; // バックエンドAPIのベースURL
    const API_BASE_URL = 'http://localhost:8000'; // バックエンドAPIのベースURL
    const token = localStorage.getItem('token'); // ログイン時に保存したトークンを取得
    // ページ遷移用
    const navigate = useNavigate();
    /**
     * アイテムの取得処理
     */
    const fetchItems = useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/items/${id}`, {
                headers: { Authorization: `Bearer ${token}` }, // トークンをヘッダーに追加
            });
            if (!response.ok) throw new Error('アイテムの取得に失敗しました'); // エラーハンドリング
            const data = await response.json(); // JSON形式のデータを取得
            setItem(data); // アイテム一覧を更新
        } catch (err) {
            setItemError(err.message); // エラー内容を状態にセット
        }
    }, [API_BASE_URL, token, id]);

    /**
     * 初回レンダリング時にアイテム、コーディネートを取得
     */
    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

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
    const handleDeleteTask = async () => {
        try {
            if (window.confirm(`${item.name}を削除しますか？`)) {
                const response = await fetch(`${API_BASE_URL}/items/${id}`, {
                    method: 'DELETE', // HTTPメソッド
                    headers: { Authorization: `Bearer ${token}` }, // トークンをヘッダーに追加
                });

                if (!response.ok) throw new Error('アイテムの削除に失敗しました'); // エラーハンドリング
                alert('アイテムが削除されました！ホーム画面を表示します');
                navigate('/home'); // ログイン画面に遷移
            } else {
                return
            }
        } catch (err) {
            setDeleteError(err.message); // エラー内容を状態にセット
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

            <footer className="fixed bottom-[1em] block w-[calc(100%_-_4em)] max-w-[calc(900px_+_4em)] m-auto text-right">
                <Link to={"/items/edit/" + id}>
                    <Button>編集する</Button>
                </Link>
                {deleteError && <ErrorText>{deleteError}</ErrorText>}
                <GrayButton onClick={handleDeleteTask}>削除する</GrayButton>
            </footer>
        </div>
    </>);
}