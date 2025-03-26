import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from "./components/Header";
import LoginForm from "./components/LoginForm";
import SignUpForm from "./components/SignUpForm";
import MyPage from "./components/MyPage";
import { HomeForUser, HomeForGuest } from "./components/Home";
import Coordinate from "./components/Coordinate";
import CoordinateForm from "./components/CoordinateForm";
import Items from "./components/Items";
import ItemForm from "./components/ItemForm";
import apiClient from './api/client';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // ログイン状態を管理
  const [username, setUsername] = useState('ゲストさん'); // ログイン中のユーザー名
  const [isLoading, setIsLoading] = useState(true); // ローディング状態

  // コンポーネントがマウントされたときにトークンをチェック
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // トークンを使ってユーザー情報を取得
          const response = await apiClient.get('/auth/me');

          setIsLoggedIn(true);
          setUsername(response.data.username);
        } catch (error) {
          // トークンが無効な場合はローカルストレージから削除
          localStorage.removeItem('token');
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
    localStorage.removeItem('token');
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
          {/* ログイン画面 */}
          <Route path="/login" element={
            isLoggedIn ? <Navigate to="/home" /> : <LoginForm onLogin={handleLogin} />
          } />
          {/* アカウント作成画面 */}
          <Route path="/signup" element={
            isLoggedIn ? <Navigate to="/home" /> : <SignUpForm />
          } />
          {/* マイページ */}
          <Route path="/mypage" element={
            isLoggedIn ? <MyPage username={username} /> : <Navigate to="/home" />
          } />
          {/* コーディネート */}
          <Route path="/coordinates/:id" element={
            isLoggedIn ? <Coordinate /> : <Navigate to="/home" />
          } />
          {/* コーディネート作成 */}
          <Route path="/coordinates/new" element={
            isLoggedIn ? <CoordinateForm mode="new" /> : <Navigate to="/home" />
          } />
          {/* アイテム */}
          <Route path="/items/:id" element={
            isLoggedIn ? <Items /> : <Navigate to="/home" />
          } />
          {/* アイテム作成 */}
          <Route path="/items/new" element={
            isLoggedIn ? <ItemForm mode="new" /> : <Navigate to="/home" />
          } />
          {/* ToDoホーム画面 */}
          <Route
            path="/home"
            element={
              isLoggedIn ? (<HomeForUser username={username} />) : (<HomeForGuest />)
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