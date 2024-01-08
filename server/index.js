const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'tapioka',
  password: process.env.DB_PASSWORD || 'tapiokazaki0604',
  database: process.env.DB_NAME || 'todo'
});

// Todoリストの取得
app.get('/todos', (req, res) => {
  connection.query('SELECT * FROM todos', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    res.json(results);
  });
});

// Todoリストの追加
app.post('/todos', (req, res) => {
    const { task } = req.body;
    connection.query('INSERT INTO todos (task) VALUES (?)', [task], (err, results) => {
      if (err) {
        // エラーハンドリング
        return res.status(500).json({ message: 'Error adding todo' });
      }
      const newTodo = { id: results.insertId, task }; // insertId は新しいTodoのID
      res.status(201).json(newTodo);
    });
  });
  

// Todoの削除
app.delete('/todos/:id', (req, res) => {
  const todoId = req.params.id;
  connection.query('DELETE FROM todos WHERE id = ?', [todoId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    res.json({ message: 'Todo deleted successfully' });
  });
});

app.listen(3001, () => {
  console.log('API server running on http://localhost:3001');
});

