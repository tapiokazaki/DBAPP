import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showDeleteButtons, setShowDeleteButtons] = useState(false);
  const [showSortMode, setShowSortMode] = useState(false);
  const [selectedForSwap, setSelectedForSwap] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/todos')
      .then(response => response.json())
      .then(data => setTodos(data));
  }, []);

  //
  const markAllComplete = () => {
    const newTodos = todos.map(todo => ({ ...todo, completed: true }));
    setTodos(newTodos);
    // オプション: 全タスクの更新をサーバーに送信
    // fetch('http://localhost:3001/todos/markAllComplete', { method: 'POST', body: JSON.stringify(newTodos) })
    //   .then(/* ... */)
    //   .catch(/* ... */);
  };
  
  const markAllIncomplete = () => {
    const newTodos = todos.map(todo => ({ ...todo, completed: false }));
    setTodos(newTodos);
    // オプション: 全タスクの更新をサーバーに送信
    // fetch('http://localhost:3001/todos/markAllIncomplete', { method: 'POST', body: JSON.stringify(newTodos) })
    //   .then(/* ... */)
    //   .catch(/* ... */);
  };

  //

  const addTodo = () => {
    fetch('http://localhost:3001/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ task })
    })
    .then(response => response.json())
    .then(newTodo => {
      setTodos([...todos, newTodo]);
      setTask(''); // 入力欄をクリア
    });
  };

  const toggleTodo = (id) => {
    // 新しいTodoリストを作成し、対象のTodoの完了状態を反転させる
    const newTodos = todos.map(todo => {
      if (todo.id === id) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    });
    setTodos(newTodos);

    // オプション: サーバーに完了状態の更新を送信する処理
    // fetch(`http://localhost:3001/todos/${id}/toggle`, { method: 'POST' })
    //   .then(/* ... */)
    //   .catch(/* ... */);
  };

  const deleteTodo = (id) => {
    fetch(`http://localhost:3001/todos/${id}`, {
      method: 'DELETE',
    })
    .then(() => {
      const updatedTodos = todos.filter(todo => todo.id !== id);
      setTodos(updatedTodos);
    });
  };

  const toggleDeleteButtons = () => {
    setShowDeleteButtons(!showDeleteButtons);
  };

  const toggleSortMode = () => {
    setShowSortMode(!showSortMode);
    setSelectedForSwap([]); // 並び替えモードをオフにする際に選択をリセット
  };

  const handleSelectForSwap = (id) => {
    setSelectedForSwap(prev => {
      const newSelection = prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id];
      if (newSelection.length === 2) {
        swapTodos(newSelection);
        return [];
      }
      return newSelection;
    });
  };

  const swapTodos = (selectedIds) => {
    const index1 = todos.findIndex(todo => todo.id === selectedIds[0]);
    const index2 = todos.findIndex(todo => todo.id === selectedIds[1]);
    setTodos(todos => {
      const newTodos = [...todos];
      [newTodos[index1], newTodos[index2]] = [newTodos[index2], newTodos[index1]];
      return newTodos;
    });
  };

  return (
    <div>
      <h1>My ToDo</h1>
      <div className="settings-button" onClick={() => setShowSettings(!showSettings)}>
        設定
      </div>
      {showSettings && (
        <div className="settings">
          <button onClick={markAllComplete}>AllTaskCheck</button>
          <button onClick={markAllIncomplete}>AllCheckReset</button>

          <button onClick={toggleDeleteButtons}
          style={{ color: showDeleteButtons ? 'green' : 'red' }}
          >
            DeleteMode {showDeleteButtons ? "ON" : "OFF"}
          </button>
          
          <button onClick={toggleSortMode}
          style={{ color: showSortMode ? 'green' : 'red' }}
          >
            SortMode {showSortMode ? "ON" : "OFF"}
          </button>

        </div>
      )}
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />
      <button onClick={addTodo}>Add Todo</button>
      <ul>
        {todos.map(todo => (
          <li
          key={todo.id}
          className={`${showSortMode ? "sortable" : ""} ${selectedForSwap.includes(todo.id) ? "selected" : ""}`}
          onClick={showSortMode ? () => handleSelectForSwap(todo.id) : null}
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            
            {showDeleteButtons && (
              <button className="button-small" onClick={() => deleteTodo(todo.id)}>削除</button>
            )}
            {todo.task}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
