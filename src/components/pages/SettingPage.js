import { useEffect, useState } from "react";
import { authMe, updateCurrentUser } from "../../api/authAPI";
import { InputText, CustomForm } from "../common/FormParts";
import ErrorText from "../common/ErrorText";
import Button from "../common/Button";
import { HintIcon } from "../common/Icon";
import { WhiteButton } from "../common/Button";
import { H2 } from "../layout/Header";
const MyPage = ({ username }) => {
    const [formData, setFormData] = useState('');
    const [updateFormData, setUpdateFormData] = useState('')
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false)
    /**
     * 初回レンダリング時にアイテムを取得
     */
    useEffect(() => {
        const fetchMe = async () => {
            try {
                const data = await authMe();
                setFormData(data);
                setUpdateFormData(data);
            } catch (err) {
                setError('ユーザー情報の取得に失敗しました');
            }
        };
        fetchMe();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdateFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateCurrentUser(updateFormData);
            setIsEditing(false);
            setError('')
        } catch (err) {
            setError("更新に失敗しました");
        }

    }

    const handleIsEditing = (status) => {
        setIsEditing(status)
    }

    const Dl = ({ dt, dd }) => {
        return (
            <dl className="flex mb-[4px]">
                <dt className="w-[8em]">{dt}</dt>
                <dd className="flex-1">：{dd}</dd>
            </dl>
        )
    }
    return (
        <div className="p-[1em]">

            {
                !isEditing ?
                    <div className="max-w-[400px] m-auto mt-[40px] p-[8px] ">
                        <H2>アカウント情報</H2>
                        <Dl dt="名前" dd={updateFormData.username} />
                        <Dl dt="メールアドレス" dd={updateFormData.email} />
                        <WhiteButton className="mt-[16px]" onClick={() => { handleIsEditing(true) }}>編集する</WhiteButton>
                    </div>
                    :
                    <CustomForm onSubmit={handleSubmit}>
                        <H2>アカウント情報を変更</H2>
                        <small>ユーザー名</small>
                        <InputText
                            placeholder="山田花子"
                            onChange={handleChange}
                            value={updateFormData.username}
                            name="username"
                            required
                        />
                        <small>メールアドレス</small>
                        <InputText
                            placeholder="user@sample.com"
                            onChange={handleChange}
                            value={updateFormData.email}
                            name="email"
                            InputType="email"
                            required
                        />
                        <small>パスワード <HintIcon title="パスワードは半角英数記号で入力してください。" /></small>
                        <InputText
                            placeholder="password123"
                            onChange={handleChange}
                            value={updateFormData.password}
                            name="password"
                            InputType="password"
                            minlength="8"
                            required
                        />
                        {error && <ErrorText className="mb-[4px]">{error}</ErrorText>}
                        <Button>変更する</Button>
                        <p className="text-center"><span className="m-auto text-sky-600 cursor-pointer hover:underline" onClick={() => { handleIsEditing(false) }}>変更しない</span></p>
                    </CustomForm>
            }
        </div>
    );
}
export default MyPage;