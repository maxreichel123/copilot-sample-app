const db = require('./db');

function initializeDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(`
        CREATE TABLE IF NOT EXISTS tasks (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          description TEXT,
          priority INTEGER NOT NULL DEFAULT 2,
          completed INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) {
          console.error('Error creating tasks table:', err.message);
          reject(err);
        } else {
          db.all('PRAGMA table_info(tasks)', [], (pragmaErr, columns) => {
            if (pragmaErr) {
              console.error('Error reading tasks schema:', pragmaErr.message);
              reject(pragmaErr);
              return;
            }

            const hasPriority = columns.some((column) => column.name === 'priority');
            if (hasPriority) {
              console.log('Tasks table ready');
              resolve();
              return;
            }

            db.run('ALTER TABLE tasks ADD COLUMN priority INTEGER NOT NULL DEFAULT 2', (alterErr) => {
              if (alterErr) {
                console.error('Error adding priority column:', alterErr.message);
                reject(alterErr);
                return;
              }
              console.log('Tasks table updated with priority');
              resolve();
            });
          });
        }
      });
    });
  });
}

module.exports = { initializeDatabase };
