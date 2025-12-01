# TaskFlow - Simple Task Management App

A minimal task management application built for the GitHub Copilot workshop.

## Features

- ✅ Create, read, update, and delete tasks
- ✅ Mark tasks as completed
- ✅ Simple and clean user interface
- ✅ SQLite database (no external dependencies)
- ✅ REST API

## Tech Stack

- **Backend**: Node.js + Express
- **Database**: SQLite3
- **Frontend**: Vanilla HTML/CSS/JavaScript
- **Testing**: Playwright

## Prerequisites

You can run this application either **locally** or using the **devcontainer**:

### Option 1: Local Development

Requires the following tools installed on your machine:
- **Node.js** (version 20 or higher recommended)
- **npm** (comes with Node.js)

### Option 2: DevContainer (Recommended)

Requires:
- **Container Runtime**: Docker Desktop, Rancher Desktop, or Podman Desktop
- **VS Code** with Dev Containers extension
- **GitHub Copilot Chat** extension (authenticated before opening the devcontainer)

See [`.devcontainer/README.md`](.devcontainer/README.md) for detailed devcontainer setup instructions.

## Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

## Running the App

### Development mode (with auto-restart)
```bash
npm run dev
```

### Production mode
```bash
npm start
```

The app will be available at `http://localhost:3000`

## API Endpoints

### Tasks

- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get a single task
- `POST /api/tasks` - Create a new task
  ```json
  {
    "title": "Task title",
    "description": "Task description (optional)"
  }
  ```
- `PUT /api/tasks/:id` - Update a task (all fields required)
  ```json
  {
    "title": "Updated title",
    "description": "Updated description",
    "completed": 1
  }
  ```
- `DELETE /api/tasks/:id` - Delete a task

## Project Structure

```
copilot-sample-app/
├── src/
│   ├── database/
│   │   ├── db.js           # Database connection
│   │   └── init.js         # Database initialization
│   ├── routes/
│   │   └── tasks.js        # Task API routes
│   └── server.js           # Express server setup
├── public/
│   ├── index.html          # Frontend UI
│   ├── styles.css          # Styles
│   └── app.js              # Frontend JavaScript
├── package.json
└── README.md
```

## Testing

Playwright is configured for E2E testing. Test files can be added in a `tests/` directory with the `.spec.js` extension.

Run tests:

```bash
npm test
```

Run tests in headed mode (see browser):

```bash
npm run test:headed
```

## Workshop Exercises

This app intentionally has some missing features that will be added during the workshop:

1. **Input Validation** - Add validation to task endpoints
2. **Comments Feature** - Add ability to comment on tasks
3. **Priority System** - Add task priorities (High/Medium/Low)
4. **Due Dates** - Add due dates to tasks (demonstrated in workshop)

## License

MIT
