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

// Helper function to escape CSV fields
function escapeCsvField(field) {
  if (field === null || field === undefined) {
    return '';
  }
  const stringField = String(field);
  // Escape quotes by doubling them, wrap in quotes if contains comma, quote, or newline
  if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n') || stringField.includes('\r')) {
    return '"' + stringField.replace(/"/g, '""') + '"';
  }
  return stringField;
}

// GET export open tasks as CSV
router.get('/export/csv', (req, res) => {
  db.all('SELECT id, title, description, created_at FROM tasks WHERE completed = 0 ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      console.error('Error exporting tasks:', err.message);
      return res.status(500).json({ error: 'Failed to export tasks' });
    }

    // Build CSV content
    const headers = ['Task ID', 'Title', 'Description', 'Created Date'];
    const csvRows = [headers.join(',')];

    for (const row of rows) {
      const csvRow = [
        escapeCsvField(row.id),
        escapeCsvField(row.title),
        escapeCsvField(row.description),
        escapeCsvField(row.created_at)
      ];
      csvRows.push(csvRow.join(','));
    }

    const csvContent = csvRows.join('\n');

    // Set headers for CSV download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="open-tasks.csv"');
    res.status(200).send(csvContent);
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
