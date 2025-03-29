import { useState } from 'react';
import { login } from '../../api/authAPI';
import Button from "../common/Button";
import CustomLink from "../common/CustomLink";
import { CustomForm, InputText } from "../common/FormParts";
import ErrorText from '../common/ErrorText';
import { HintIcon } from '../common/Icon';

const LoginPage = ({ onLogin }) => {
    const [email, setEmail] = useState(''); // ユーザー名入力
    const [password, setPassword] = useState(''); // パスワード入力
    const [error, setError] = useState(''); // エラーメッセージ

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await login(email, password);
            const { access_token, refresh_token, username } = response.data; // トークンを取得
            localStorage.setItem('access_token', access_token); // アクセストークンをローカルストレージに保存
            localStorage.setItem('refresh_token', refresh_token); // リフレッシュトークンをローカルストレージに保存
            onLogin(username); // 親コンポーネントにログインイベントを伝達
        } catch (err) {
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
export default LoginPage;