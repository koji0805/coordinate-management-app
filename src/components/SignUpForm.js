import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';
import Button from "./Button";
import CustomLink from "./CustomLink";
import { CustomForm, InputText } from "./FormParts";
import ErrorText from './ErrorText';
import HintIcon from './HintIcon';

const SignUpForm = () => {
    // フォームデータの状態管理
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });

    // バリデーションエラーの状態管理
    const [error, setError] = useState('');

    // ページ遷移用
    const navigate = useNavigate();

    // 入力フィールドの値を更新
    const handleChange = (e) => {
        const { name, value } = e.target; // 入力フィールドの名前と値を取得
        setFormData({ ...formData, [name]: value }); // 現在のフォームデータに新しい値をセット
    };

    // フォーム送信時の処理
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await apiClient.post('/auth/signup', formData); // バックエンドにアカウント作成リクエストを送信
            alert('アカウントが作成されました！ログイン画面に進んでください。');
            navigate('/login'); // ログイン画面に遷移
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
                    setError(err.response.data.detail || 'アカウント作成に失敗しました');
                }
            } else {
                setError('アカウント作成に失敗しました。入力内容を確認してください。');
            }
        }
    };
    return (<>
        <CustomForm onSubmit={handleSubmit}>
            <small>ユーザー名</small>
            <InputText
                placeholder="山田花子"
                onChange={handleChange}
                value={formData.username}
                name="username"
                required
            />
            <small>メールアドレス</small>
            <InputText
                placeholder="user@sample.com"
                onChange={handleChange}
                value={formData.email}
                name="email"
                InputType="email"
                required
            />
            <small>パスワード <HintIcon title="パスワードは半角英数記号で入力してください。" /></small>
            <InputText
                placeholder="password123"
                onChange={handleChange}
                value={formData.password}
                name="password"
                InputType="password"
                required
            />
            {error && <ErrorText className="mb-[4px]">{error}</ErrorText>}
            <Button>新規登録する</Button>
            <p className="text-center"><CustomLink to="/login">ログインする</CustomLink></p>
        </CustomForm>
    </>)
}
export default SignUpForm;