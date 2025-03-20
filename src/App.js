import { useEffect, useState } from "react";

function App() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    // http://localhost:8000/api/todoにアクセスし、todoのリストを取得
    fetch("http://localhost:8000/api/todo")
      .then((response) => response.json())
      .then((data) => setTodos(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div>
      <h1>Todo List</h1>
      {/* todosの内容をリスト(<ul><li>)を使用して一覧表示 */}
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;