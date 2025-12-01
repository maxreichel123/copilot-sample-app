const API_URL = '/api/tasks';

// Load tasks on page load
document.addEventListener('DOMContentLoaded', () => {
  loadTasks();
  
  // Handle form submission
  document.getElementById('add-task-form').addEventListener('submit', handleAddTask);
});

// Fetch and display all tasks
async function loadTasks() {
  try {
    const response = await fetch(API_URL);
    const tasks = await response.json();
    displayTasks(tasks);
  } catch (error) {
    console.error('Error loading tasks:', error);
    alert('Failed to load tasks');
  }
}

// Display tasks in the UI
function displayTasks(tasks) {
  const container = document.getElementById('tasks-container');
  
  if (tasks.length === 0) {
    container.innerHTML = '<div class="empty-state"><p>No tasks yet. Add one above!</p></div>';
    return;
  }
  
  container.innerHTML = tasks.map(task => `
    <div class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
      <div class="task-header">
        <div class="task-title">${escapeHtml(task.title)}</div>
      </div>
      ${task.description ? `<div class="task-description">${escapeHtml(task.description)}</div>` : ''}
      <div class="task-actions">
        <label>
          <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${task.id}, this.checked)">
          Completed
        </label>
        <button class="btn btn-danger" onclick="deleteTask(${task.id})">Delete</button>
      </div>
    </div>
  `).join('');
}

// Handle adding a new task
async function handleAddTask(e) {
  e.preventDefault();
  
  const title = document.getElementById('task-title').value.trim();
  const description = document.getElementById('task-description').value.trim();
  
  if (!title) {
    alert('Title is required');
    return;
  }
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title, description })
    });
    
    if (response.ok) {
      document.getElementById('add-task-form').reset();
      loadTasks();
    } else {
      const error = await response.json();
      alert('Failed to add task: ' + error.error);
    }
  } catch (error) {
    console.error('Error adding task:', error);
    alert('Failed to add task');
  }
}

// Toggle task completion status
async function toggleTask(id, completed) {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    const task = await response.json();
    
    const updateResponse = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...task,
        completed: completed ? 1 : 0
      })
    });
    
    if (updateResponse.ok) {
      loadTasks();
    } else {
      const error = await updateResponse.json();
      alert('Failed to update task: ' + error.error);
    }
  } catch (error) {
    console.error('Error updating task:', error);
    alert('Failed to update task');
  }
}

// Delete a task
async function deleteTask(id) {
  if (!confirm('Are you sure you want to delete this task?')) {
    return;
  }
  
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });
    
    if (response.ok) {
      loadTasks();
    } else {
      const error = await response.json();
      alert('Failed to delete task: ' + error.error);
    }
  } catch (error) {
    console.error('Error deleting task:', error);
    alert('Failed to delete task');
  }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
