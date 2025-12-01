---
applyTo: "src/database/**,**/db.js,**/init.js"
---

# Database Instructions

## SQLite Patterns
- Use parameterized queries (?) to prevent SQL injection
- Always use `db.serialize()` for sequential operations
- Handle database errors with proper error messages
- Return promises for async operations

## Schema Design
- Use INTEGER PRIMARY KEY AUTOINCREMENT for IDs
- Use DATETIME DEFAULT CURRENT_TIMESTAMP for timestamps
- Use INTEGER (0/1) for boolean values
- Keep table names plural (tasks, users, comments)

## Error Handling
- Always check for database errors in callbacks
- Log errors with context (table name, operation)
- Return meaningful error messages to the API layer
- Close connections properly

## Transactions
- Use transactions for multi-table operations
- Always include rollback logic
- Keep transactions short and focused

## Example Pattern
```javascript
db.run('INSERT INTO tasks (title) VALUES (?)', [title], function(err) {
  if (err) {
    return callback({ error: err.message });
  }
  callback(null, { id: this.lastID });
});
```
