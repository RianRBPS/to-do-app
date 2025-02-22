const { Pool } = require('pg');

const pool = new Pool({
  user: 'user',
  host: 'db',
  database: 'todo_db',
  password: 'password',
  port: 5432, // Internal PostgreSQL port
});

const createTableAndInsertData = async () => {
  try {
    // Create table if it doesn't exist
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS todos (
          id SERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          completed BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT NOW()
      );
    `;
    await pool.query(createTableQuery);
    console.log("✅ Table 'todos' is ready!");

    // Insert sample data only if table is empty
    const checkDataQuery = 'SELECT COUNT(*) FROM todos';
    const { rows } = await pool.query(checkDataQuery);
    
    if (parseInt(rows[0].count) === 0) {
      const insertSampleTodosQuery = `
        INSERT INTO todos (title, completed) VALUES
        ('Learn Docker', false),
        ('Set up PostgreSQL with Node.js', true),
        ('Build a REST API', false),
        ('Write integration tests', false);
      `;
      await pool.query(insertSampleTodosQuery);
      console.log("✅ Sample todos inserted!");
    } else {
      console.log("⚠️ Sample data already exists, skipping insertion.");
    }
  } catch (err) {
    console.error("❌ Error setting up database:", err);
  } finally {
    pool.end();
  }
};

createTableAndInsertData();
