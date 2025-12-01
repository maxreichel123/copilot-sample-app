const express = require('express');
const router = express.Router();
const db = require('../database/db');

// GET all tasks
router.get('/', (req, res) => {
  db.all('SELECT * FROM tasks ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// GET single task
router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM tasks WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(row);
  });
});

// POST create new task
router.post('/', (req, res) => {
  const { title, description } = req.body;
  
  db.run(
    'INSERT INTO tasks (title, description) VALUES (?, ?)',
    [title, description],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: this.lastID, title, description, completed: 0 });
    }
  );
});

// PUT update task
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, completed } = req.body;
  
  db.run(
    'UPDATE tasks SET title = ?, description = ?, completed = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [title, description, completed, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.json({ id, title, description, completed });
    }
  );
});

// DELETE task
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM tasks WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ message: 'Task deleted' });
  });
});

module.exports = router;
