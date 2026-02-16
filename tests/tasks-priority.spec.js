const { test, expect } = require('@playwright/test');

test.describe('Task Priority Feature', () => {
  
  test.beforeEach(async ({ request }) => {
    // Clean up: Delete all tasks before each test
    const response = await request.get('/api/tasks');
    const tasks = await response.json();
    for (const task of tasks) {
      await request.delete(`/api/tasks/${task.id}`);
    }
  });

  test('should create task with default priority (Medium/2) when no priority specified', async ({ request }) => {
    const response = await request.post('/api/tasks', {
      data: {
        title: 'Test Task',
        description: 'Test Description'
      }
    });

    expect(response.status()).toBe(201);
    const task = await response.json();
    expect(task.priority).toBe(2);
    expect(task.title).toBe('Test Task');
  });

  test('should create task with priority High (1)', async ({ request }) => {
    const response = await request.post('/api/tasks', {
      data: {
        title: 'High Priority Task',
        description: 'Important task',
        priority: 1
      }
    });

    expect(response.status()).toBe(201);
    const task = await response.json();
    expect(task.priority).toBe(1);
  });

  test('should create task with priority Medium (2)', async ({ request }) => {
    const response = await request.post('/api/tasks', {
      data: {
        title: 'Medium Priority Task',
        description: 'Normal task',
        priority: 2
      }
    });

    expect(response.status()).toBe(201);
    const task = await response.json();
    expect(task.priority).toBe(2);
  });

  test('should create task with priority Low (3)', async ({ request }) => {
    const response = await request.post('/api/tasks', {
      data: {
        title: 'Low Priority Task',
        description: 'Not urgent',
        priority: 3
      }
    });

    expect(response.status()).toBe(201);
    const task = await response.json();
    expect(task.priority).toBe(3);
  });

  test('should accept priority as string and convert to number', async ({ request }) => {
    const response = await request.post('/api/tasks', {
      data: {
        title: 'Task with string priority',
        priority: '1'
      }
    });

    expect(response.status()).toBe(201);
    const task = await response.json();
    expect(task.priority).toBe(1);
  });

  test('should reject invalid priority value 0', async ({ request }) => {
    const response = await request.post('/api/tasks', {
      data: {
        title: 'Invalid Priority Task',
        priority: 0
      }
    });

    expect(response.status()).toBe(400);
    const error = await response.json();
    expect(error.error).toContain('must be 1, 2, or 3');
  });

  test('should reject invalid priority value 4', async ({ request }) => {
    const response = await request.post('/api/tasks', {
      data: {
        title: 'Invalid Priority Task',
        priority: 4
      }
    });

    expect(response.status()).toBe(400);
    const error = await response.json();
    expect(error.error).toContain('must be 1, 2, or 3');
  });

  test('should reject invalid priority value -1', async ({ request }) => {
    const response = await request.post('/api/tasks', {
      data: {
        title: 'Invalid Priority Task',
        priority: -1
      }
    });

    expect(response.status()).toBe(400);
    const error = await response.json();
    expect(error.error).toContain('must be 1, 2, or 3');
  });

  test('should reject non-numeric priority value', async ({ request }) => {
    const response = await request.post('/api/tasks', {
      data: {
        title: 'Invalid Priority Task',
        priority: 'high'
      }
    });

    expect(response.status()).toBe(400);
    const error = await response.json();
    expect(error.error).toContain('must be 1, 2, or 3');
  });

  test('should update task priority', async ({ request }) => {
    // Create task with default priority
    const createResponse = await request.post('/api/tasks', {
      data: {
        title: 'Task to Update',
        description: 'Initial description'
      }
    });
    const createdTask = await createResponse.json();

    // Update priority to High
    const updateResponse = await request.put(`/api/tasks/${createdTask.id}`, {
      data: {
        title: 'Task to Update',
        description: 'Initial description',
        completed: 0,
        priority: 1
      }
    });

    expect(updateResponse.status()).toBe(200);
    const updatedTask = await updateResponse.json();
    expect(updatedTask.priority).toBe(1);
  });

  test('should require priority field in PUT request', async ({ request }) => {
    // Create task
    const createResponse = await request.post('/api/tasks', {
      data: {
        title: 'Task to Update'
      }
    });
    const createdTask = await createResponse.json();

    // Try to update without priority
    const updateResponse = await request.put(`/api/tasks/${createdTask.id}`, {
      data: {
        title: 'Updated Title',
        description: 'Updated description',
        completed: 0
      }
    });

    expect(updateResponse.status()).toBe(400);
    const error = await updateResponse.json();
    expect(error.error).toContain('must be 1, 2, or 3');
  });

  test('should reject invalid priority in PUT request', async ({ request }) => {
    // Create task
    const createResponse = await request.post('/api/tasks', {
      data: {
        title: 'Task to Update'
      }
    });
    const createdTask = await createResponse.json();

    // Try to update with invalid priority
    const updateResponse = await request.put(`/api/tasks/${createdTask.id}`, {
      data: {
        title: 'Updated Title',
        description: 'Updated description',
        completed: 0,
        priority: 5
      }
    });

    expect(updateResponse.status()).toBe(400);
    const error = await updateResponse.json();
    expect(error.error).toContain('must be 1, 2, or 3');
  });

  test('should sort tasks by priority in descending order', async ({ request }) => {
    // Create tasks with different priorities
    await request.post('/api/tasks', {
      data: { title: 'Low Priority Task', priority: 3 }
    });
    await request.post('/api/tasks', {
      data: { title: 'High Priority Task', priority: 1 }
    });
    await request.post('/api/tasks', {
      data: { title: 'Medium Priority Task', priority: 2 }
    });

    // Get all tasks
    const response = await request.get('/api/tasks');
    expect(response.status()).toBe(200);
    const tasks = await response.json();

    // Verify sorting: DESC means 3, 2, 1 (Low, Medium, High)
    expect(tasks.length).toBe(3);
    expect(tasks[0].priority).toBe(3); // Low priority first (DESC order)
    expect(tasks[1].priority).toBe(2); // Medium priority second
    expect(tasks[2].priority).toBe(1); // High priority last
  });

  test('should reject empty string priority as invalid', async ({ request }) => {
    const response = await request.post('/api/tasks', {
      data: {
        title: 'Task with empty priority',
        priority: ''
      }
    });

    expect(response.status()).toBe(400);
    const error = await response.json();
    expect(error.error).toContain('must be 1, 2, or 3');
  });

  test('should reject null priority as invalid', async ({ request }) => {
    const response = await request.post('/api/tasks', {
      data: {
        title: 'Task with null priority',
        priority: null
      }
    });

    expect(response.status()).toBe(400);
    const error = await response.json();
    expect(error.error).toContain('must be 1, 2, or 3');
  });

  test('should retrieve task with correct priority', async ({ request }) => {
    // Create task with specific priority
    const createResponse = await request.post('/api/tasks', {
      data: {
        title: 'Task with Priority',
        priority: 1
      }
    });
    const createdTask = await createResponse.json();

    // Get the specific task
    const getResponse = await request.get(`/api/tasks/${createdTask.id}`);
    expect(getResponse.status()).toBe(200);
    const task = await getResponse.json();
    expect(task.priority).toBe(1);
  });
});
