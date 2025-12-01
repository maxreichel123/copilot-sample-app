# TaskFlow - GitHub Copilot Workshop Sample App

## Project Overview

TaskFlow is a minimal task management application built for teaching GitHub Copilot features. The app demonstrates CRUD operations with a clean architecture suitable for workshop exercises.

## Architecture

- **Backend**: Node.js + Express REST API
- **Database**: SQLite (simple, no external dependencies)
- **Frontend**: Vanilla HTML/CSS/JavaScript

## Tech Stack

- Node.js & Express for API server
- SQLite3 for data persistence
- Playwright for E2E testing

## Coding Standards

### JavaScript Style
- Use ES6+ features where appropriate
- Use `const` and `let` instead of `var`
- Use arrow functions for callbacks
- Use async/await for asynchronous operations
- Always use semicolons

### Naming Conventions
- Use camelCase for variables and functions
- Use PascalCase for classes
- Use UPPER_SNAKE_CASE for constants
- Use descriptive names (avoid single letters except loop counters)

### Error Handling
- Always handle errors in async operations
- Return consistent error responses: `{ error: "message" }`
- Log errors with context for debugging
- Use appropriate HTTP status codes:
  - 200: Success
  - 201: Created
  - 400: Bad Request (validation errors)
  - 404: Not Found
  - 500: Internal Server Error

### API Design
- Follow REST conventions
- Use plural nouns for endpoints (`/api/tasks`)
- Use HTTP methods correctly (GET, POST, PUT, DELETE)
- Return JSON responses
- Include proper status codes

### Database
- Use parameterized queries to prevent SQL injection
- Always handle database errors
- Use transactions for multi-table operations
- Keep database logic in the database layer

### Security
- Never commit secrets or API keys
- Validate and sanitize all user inputs
- Use parameterized queries to prevent SQL injection

### Testing
- Use Playwright for E2E tests
- Test happy paths and error scenarios
- Use descriptive test names

## File Organization

```
src/
  database/     - Database connection and initialization
  routes/       - API route handlers
  server.js     - Express server setup
public/         - Frontend static files
tests/          - Playwright E2E tests
```

## Comments
- Write comments for complex logic
- Avoid obvious comments
- Keep comments up-to-date with code changes
- Use JSDoc for function documentation when helpful
