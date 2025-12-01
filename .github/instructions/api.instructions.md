---
applyTo: "src/routes/**,src/server.js"
---

# API Instructions

## REST Conventions
- Use plural nouns for endpoints (`/api/tasks`, not `/api/task`)
- Use HTTP methods correctly:
  - GET: Retrieve data
  - POST: Create new resource
  - PUT: Update entire resource
  - DELETE: Remove resource

## Request Handling
- Always validate request body
- Use `express.json()` middleware for JSON parsing
- Check for required fields before processing
- Sanitize user input

## Response Format
- Always return JSON
- Use consistent response structure
- Success: Return the data directly or with a message
- Error: Return `{ error: "message" }` format

## Status Codes
- 200: Successful GET/PUT/DELETE
- 201: Successful POST (resource created)
- 400: Bad request (validation errors)
- 404: Resource not found
- 500: Internal server error

## Error Handling
- Wrap async operations in try-catch
- Log errors with request context
- Never expose internal error details to clients
- Return user-friendly error messages

## Example Pattern
```javascript
router.post('/', (req, res) => {
  const { title } = req.body;
  
  // Validate
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  
  // Process
  db.run('INSERT INTO tasks (title) VALUES (?)', [title], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID, title });
  });
});
```
