const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 4200;

// PostgreSQL connection configuration
const pool = new Pool({ // instancia de pool da livraria pg
  user: 'user',
  host: 'db', 
  database: 'todo_db',
  password: 'password',
  port: 5432,
});

// Middleware that enables JSON parsing in incoming requests (req.body)
app.use(express.json());
app.use((req, res, next) => {
    console.log('time', Date.now())
    console.log(req)
    next();
})

// Test route
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// db test
app.get('/db-test', async (req, res) => {
    try {
      const client = await pool.connect(); 
      const result = await client.query('SELECT NOW() as current_time');
      client.release();
      res.json({ message: 'database connect', time: result.rows[0].current_time });
    } catch (err) {
      console.error('database connection error:', err);
      res.status(500).json({ error: 'failed to connect to database' });
    }
  });
  

// Get all todos
app.get('/api/todos', async (req, res) => { // await aguarda o resultado
  try {
    const result = await pool.query('SELECT * FROM todos ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching todos:', err);
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

// Create a new todo
app.post('/api/todos', async (req, res) => {
  const { title } = req.body;
  try {
    const result = await pool.query('INSERT INTO todos (title) VALUES ($1) RETURNING *', [title]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error adding todo:', err);
    res.status(500).json({ error: 'Failed to add todo' });
  }
});

// Update a todo
app.put('/api/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  try {
    const result = await pool.query('UPDATE todos SET title = $1, completed = $2 WHERE id = $3 RETURNING *', [title, completed, id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating todo:', err);
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

// Delete a todo
app.delete('/api/todos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM todos WHERE id = $1', [id]);
    res.json({ message: 'Todo deleted successfully' });
  } catch (err) {
    console.error('Error deleting todo:', err);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
