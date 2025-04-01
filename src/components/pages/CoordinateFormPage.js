import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { FaImage } from "react-icons/fa";
import Datepicker from "react-tailwindcss-datepicker";
import { API_BASE_URL } from "../../api/client";
import { getCoordinate, postCoordinate, putCoordinate } from "../../api/coordinateAPI";
import { getCoordinateItems, postCoordinateItems, putCoordinateItems } from "../../api/coordinate_itemsAPI";
import { getAllItems } from "../../api/itemsAPI";
import { postImage } from "../../api/imagesAPI";
import { CustomForm, InputText, Textarea, InputPhoto } from "../common/FormParts";
import { H2 } from "../layout/Header";
import Button, { WhiteButton } from "../common/Button";
import ItemFilter from "../item/ItemFilter";
import ErrorText from "../common/ErrorText";
import Modal from "../common/Modal";


export default function ItemForm({ mode }) {
    const today = useMemo(() => new Date().toISOString(), []);
    const [isLoading, setIsLoading] = useState(true);
    // フォームデータの状態管理
    const [formCoordData, setCoordFormData] = useState({
        name: '',
        day: today,
        memo: '',
    });

    const [formCoodItemData, setFormCoodItemData] = useState({
        items: [],
    })

    const { id } = useParams(); // URLの:idを取得
    // アイテム全体の状態管理
    const [items, setItems] = useState([]);
    const [coordinateError, setCoordinateError] = useState('')
    const [checkedItems, setCheckedItems] = useState([]);
    const [coordinateItemsError, setCoordinateItemsError] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('すべて');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [image, setImage] = useState(null);
    const [prevImageURL, setPrevImageURL] = useState(``);
    /**
     * フィルタリング状態に応じたアイテムリストを取得
     */
    const filteredItems = items.filter((item) => {
        if (selectedCategory === "すべて") {
            return true;
        }
        return item.category === selectedCategory;
    });

    const handleOpenModal = () => {
        setCheckedItems(formCoodItemData.items)
        setIsModalOpen(true)
    };
    const handleCloseModal = () => setIsModalOpen(false);

    const handleCheckedItems = () => {
        setFormCoodItemData(prevData => ({
            ...prevData,
            items: checkedItems
        }));
        handleCloseModal();
    }

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
                    if (data_coordinates.photo_url) {
                        setPrevImageURL(`${API_BASE_URL}${data_coordinates.photo_url}`);
                    }
                    setIsLoading(false);
                } catch (err) {
                    setCoordinateError('コーディネートの取得に失敗しました');
                }
            };
            fetchCoordinate();

            const fetchCoordinateItems = async () => {
                try {
                    const data_coordinateItems = await getCoordinateItems(id);
                    const item_list = data_coordinateItems.map((item) => item.id);
                    setFormCoodItemData(prevData => ({
                        ...prevData,
                        "items": item_list,
                    }));
                    setCheckedItems(item_list);
                } catch (err) {
                    setCoordinateItemsError('使用したアイテムの取得に失敗しました');
                }
            };
            fetchCoordinateItems();
        } else {
            setPrevImageURL('');
            setIsLoading(false);
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
    }, [id, mode]);

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
        const formCoordItemsData = {
            used_items: formCoodItemData.items
        };
        try {
            const updatedData = { ...formCoordData };
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
                const newId = await postCoordinate(updatedData);
                await postCoordinateItems(newId, formCoordItemsData);
                alert('コーディネートが作成されました！ホームから確認できます');
            } else {
                await putCoordinate(id, updatedData);
                await putCoordinateItems(id, formCoordItemsData);
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

    if (coordinateError) return <div>コーディネートエラー: {coordinateError.message}</div>;
    if (coordinateItemsError) return <div>使用アイテムエラー: {coordinateItemsError}</div>;
    return (<>
        <CustomForm className="!mt-[20px]" onSubmit={handleSubmit}>
            <H2>{mode === "new" ? "作成" : "編集"}</H2>
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
                        formCoordData.day
                            ? { startDate: formCoordData.day, endDate: formCoordData.day }
                            : { startDate: today, endDate: today }
                    }
                    onChange={
                        (newValue) => {
                            handleChange({
                                target: {
                                    name: 'day',
                                    value: newValue.startDate
                                }
                            })
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
            {checkedItems ?
                <ul>
                    {
                        items.filter((item) => checkedItems.includes(item.id)).map((item) => (
                            <li className="inline-block border rounded-sm w-[120px] h-[100px] mr-[8px] nth-[3n]:mr-0 mb-[8px] p-[4px] bg-sky-600 text-slate-50" title={item.name} key={item.id}>
                                <p className="p-[.5em] bg-slate-400 text-center text-slate-50">
                                    <span className="text-[40px] inline-block">
                                        <FaImage />
                                    </span>
                                </p>
                                <p className="text-xs w-[100%] overflow-hidden overflow-ellipsis whitespace-nowrap mt-[4px]">{item.name}</p>
                            </li>
                        ))}
                </ul >
                : <p>未選択です</p>}
            <WhiteButton className="!mb-[8px]" type="button" onClick={handleOpenModal}>アイテムを選択する</WhiteButton>
            <Modal
                className=""
                containerClass="h-[60vh]"
                header="使用したアイテムを選択"
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                footerPrimaryBtn="選択する"
                primaryBtnFunc={handleCheckedItems}
            >
                {/* フィルタリングボタン */}
                <ItemFilter selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
                <ul>
                    {filteredItems.length > 0 ?
                        filteredItems.map((item) => (
                            <li className={"inline-block cursor-pointer border rounded-sm w-[120px] h-[100px] mr-[8px] nth-[3n]:mr-0 mb-[8px] p-[4px] hover:opacity-50 " + (checkedItems.includes(item.id) ? "bg-sky-600 text-slate-50" : "border-sky-600")} title={item.name} key={item.id}>
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
                            </li>
                        )) :
                        <p>表示するアイテムがありません。</p>
                    }
                </ul>
            </Modal>
            {coordinateItemsError && <ErrorText>{coordinateItemsError}</ErrorText>}
            <small>写真</small>
            <div className="mb-[28px]">
                {!isLoading && (
                    <InputPhoto onImageSelect={(file) => setImage(file)} prevPhoto={prevImageURL || ''} />
                )}
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