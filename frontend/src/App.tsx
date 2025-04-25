import React, { useEffect, useState } from 'react';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    // ここでブレークポイントをテストできます
    const testDebugger = async () => {
      try {
        const response = await fetch('http://localhost:8000/debug-test');
        const data = await response.json();
        setMessage(data.message);
      } catch (error) {
        console.error('デバッグテストエラー:', error);
      }
    };

    testDebugger();
  }, []);

  return (
    <div className="App">
      <h1>デバッグテスト</h1>
      <p>{message}</p>
    </div>
  );
}

export default App; 