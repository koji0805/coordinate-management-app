import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';
import Button from "./Button";
import CustomLink from "./CustomLink";
import { CustomForm, InputText } from "./FormParts";
import ErrorText from './ErrorText';
import HintIcon from './HintIcon';

const LoginCustomForm = ({ onLogin }) => {
    const [email, setEmail] = useState(''); // ユーザー名入力
    const [password, setPassword] = useState(''); // パスワード入力
    const [error, setError] = useState(''); // エラーメッセージ
    const navigate = useNavigate(); // ページ遷移用

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await apiClient.post('/auth/login', { email, password }); // ログインリクエスト
            const { token } = response.data; // トークンを取得
            const { username } = response.data; // ユーザーネームを取得
            localStorage.setItem('token', token); // トークンをローカルストレージに保存
            onLogin(username); // 親コンポーネントにログインイベントを伝達
            navigate('/home'); // ホーム画面に遷移
        } catch {
            setError('ログインに失敗しました。ユーザー名またはパスワードを確認してください。');
        }
    };
    return (<>
        <CustomForm onSubmit={handleLogin}>
            <small>メールアドレス</small>
            <InputText
                placeholder="user@sample.com"
                value={email}
                InputType="email"
                onChange={(e) => setEmail(e.target.value)}
            />
            <small>パスワード <HintIcon title="パスワードは半角英数記号で入力してください。" /></small>
            <InputText
                placeholder="password123"
                value={password}
                InputType="password"
                onChange={(e) => setPassword(e.target.value)}
            />
            {error && <ErrorText>{error}</ErrorText>}
            <Button >ログインする</Button>
            <p className="text-center"><CustomLink to="/signup">新規登録する</CustomLink></p>
        </CustomForm>
    </>)
}
export default LoginCustomForm;