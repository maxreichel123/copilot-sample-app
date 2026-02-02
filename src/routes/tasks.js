const express = require('express');
const router = express.Router();
const db = require('../database/db');

const normalizePriority = (value) => {
  if (value === undefined || value === null || value === '') {
    return null;
  }
  const parsed = Number.parseInt(value, 10);
  if ([1, 2, 3].includes(parsed)) {
    return parsed;
  }
  return null;
};

const normalizeCompleted = (value) => {
  if (value === 0 || value === 1) {
    return value;
  }
  if (value === true) {
    return 1;
  }
  if (value === false) {
    return 0;
  }
  return null;
};

// GET all tasks
router.get('/', (req, res) => {
  db.all('SELECT * FROM tasks ORDER BY priority DESC, created_at DESC', [], (err, rows) => {
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
  const { title, description, priority } = req.body;
  const trimmedTitle = typeof title === 'string' ? title.trim() : '';
  const normalizedPriority = normalizePriority(priority) ?? 2;

  if (!trimmedTitle) {
    return res.status(400).json({ error: 'Title is required' });
  }
  if (priority !== undefined && normalizePriority(priority) === null) {
    return res.status(400).json({ error: 'Priorty must be 1, 2, or 3' });
  }
  
  db.run(
    'INSERT INTO tasks (title, description, priority) VALUES (?, ?, ?)',
    [trimmedTitle, description, normalizedPriority],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({
        id: this.lastID,
        title: trimmedTitle,
        description,
        priority: normalizedPriority,
        completed: 0
      });
    }
  );
});

// PUT update task
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, completed, priority } = req.body;
  const trimmedTitle = typeof title === 'string' ? title.trim() : '';
  const normalizedCompleted = normalizeCompleted(completed);
  const normalizedPriority = normalizePriority(priority);

  if (!trimmedTitle) {
    return res.status(400).json({ error: 'Title is required' });
  }
  if (normalizedCompleted === null) {
    return res.status(400).json({ error: 'Completed must be 0 or 1' });
  }
  if (normalizedPriority === null) {
    return res.status(400).json({ error: 'Priorty must be 1, 2, or 3' });
  }
  
  db.run(
    'UPDATE tasks SET title = ?, description = ?, priority = ?, completed = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [trimmedTitle, description, normalizedPriority, normalizedCompleted, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.json({
        id,
        title: trimmedTitle,
        description,
        priority: normalizedPriority,
        completed: normalizedCompleted
      });
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
