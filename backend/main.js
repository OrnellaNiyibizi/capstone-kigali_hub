const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Initialize SQLite database
const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
    db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )`);
    db.run(`CREATE TABLE IF NOT EXISTS resources (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            category TEXT NOT NULL,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            contact TEXT NOT NULL
        )`);
  }
});

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the Women Resources API');
});

// User Registration
app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  db.run(`INSERT INTO users (name, email, password) VALUES (?, ?, ?)`, [name, email, password], function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
    } else {
      res.json({ message: 'User registered successfully', userId: this.lastID });
    }
  });
});

// Get All Resources
app.get('/resources', (req, res) => {
  db.all(`SELECT * FROM resources`, [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Add a Resource
app.post('/resources', (req, res) => {
  const { category, title, description, contact } = req.body;
  db.run(`INSERT INTO resources (category, title, description, contact) VALUES (?, ?, ?, ?)`,
    [category, title, description, contact], function (err) {
      if (err) {
        res.status(400).json({ error: err.message });
      } else {
        res.json({ message: 'Resource added successfully', resourceId: this.lastID });
      }
    });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
