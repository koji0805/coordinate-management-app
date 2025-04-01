import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { authMe } from "./api/authAPI";
import Header from "./components/layout/Header";
import LoginPage from "./components/pages/LoginPage";
import SignUpPage from "./components/pages/SignUpPage";
import SettingPage from "./components/pages/SettingPage";
import { HomeForUser, HomeForGuest } from "./components/pages/HomePage";
import CoordinatePage from "./components/pages/CoordinatePage";
import CoordinateFormPage from "./components/pages/CoordinateFormPage";
import ItemPage from "./components/pages/ItemPage";
import ItemFormPage from "./components/pages/ItemFormPage";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // ログイン状態を管理
  const [username, setUsername] = useState('ゲストさん'); // ログイン中のユーザー名
  const [isLoading, setIsLoading] = useState(true); // ローディング状態
  const [homeType, setHomeType] = useState('coordinate');

  // コンポーネントがマウントされたときにトークンをチェック
  useEffect(() => {
    const verifyToken = async () => {
      const access_token = localStorage.getItem('access_token');
      if (access_token) {
        try {
          // トークンを使ってユーザー情報を取得
          const userData = await authMe(access_token);
          setIsLoggedIn(true);
          setUsername(userData.username);
        } catch (error) {
          // トークンが無効な場合はローカルストレージから削除
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
      }
      setIsLoading(false);
    };
    verifyToken();
  }, []);

  // ログイン処理
  const handleLogin = (username) => {
    setIsLoggedIn(true); // ログイン状態を更新
    setUsername(username); // ユーザー名を記録
  };

  // ログアウト処理
  const handleLogout = () => {
    setIsLoggedIn(false); // ログイン状態をリセット
    setUsername(''); // ユーザー名をリセット
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  };

  // ローディング中はローディング表示
  if (isLoading) {
    return <div>読込中...</div>;
  }

  return (
    <Router>
      <div>
        <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        <Routes>
          {isLoggedIn ?
            (
              <>
                {/* 設定 */}
                < Route path="/setting" element={<SettingPage username={username} />} />

                {/* コーディネート */}
                <Route path="/coordinate/:id" element={<CoordinatePage />} />
                {/* コーディネート作成 */}
                <Route path="/coordinate/new" element={<CoordinateFormPage mode="new" />} />
                {/* アイテム編集 */}
                <Route path="/coordinate/edit/:id" element={<CoordinateFormPage mode="edit" />} />

                {/* アイテム */}
                <Route path="/item/:id" element={<ItemPage />} />
                {/* アイテム作成 */}
                <Route path="/item/new" element={<ItemFormPage mode="new" />} />
                {/* アイテム編集 */}
                <Route path="/item/edit/:id" element={<ItemFormPage mode="edit" />} />
              </>
            ) : (
              <>
                {/* アカウント作成画面 */}
                <Route path="/signup" element={<SignUpPage />} />
                {/* ログイン画面 */}
                <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
              </>
            )
          }
          {/* ToDoホーム画面 */}
          <Route
            path="/home"
            element={
              isLoggedIn ? (<HomeForUser username={username} type={homeType} setHomeType={setHomeType} />) : (<HomeForGuest />)
            }
          />
          {/* デフォルトはログイン画面へ */}
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;