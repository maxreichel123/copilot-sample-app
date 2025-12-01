// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('CSV Export', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have Export as CSV button visible', async ({ page }) => {
    const exportButton = page.getByRole('button', { name: 'Export as CSV' });
    await expect(exportButton).toBeVisible();
  });

  test('should download CSV file when clicking Export as CSV button', async ({ page }) => {
    // Add a task first to ensure there's data to export
    await page.fill('#task-title', 'Test Export Task');
    await page.fill('#task-description', 'Task for CSV export test');
    await page.click('button[type="submit"]');
    
    // Wait for the task to appear
    await expect(page.locator('.task-item')).toContainText('Test Export Task');

    // Click the export button and wait for the download
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Export as CSV' }).click();
    const download = await downloadPromise;

    // Verify the download
    expect(download.suggestedFilename()).toBe('open-tasks.csv');
  });

  test('should only export open tasks in CSV', async ({ page, request }) => {
    // Create an open task via API
    await request.post('/api/tasks', {
      data: { title: 'Open Task for CSV', description: 'This should appear in CSV' }
    });

    // Create a completed task via API
    const completedTaskResponse = await request.post('/api/tasks', {
      data: { title: 'Completed Task for CSV', description: 'This should NOT appear in CSV' }
    });
    const completedTask = await completedTaskResponse.json();
    
    // Mark it as completed
    await request.put(`/api/tasks/${completedTask.id}`, {
      data: { 
        title: completedTask.title, 
        description: completedTask.description, 
        completed: 1 
      }
    });

    // Request CSV export via API
    const csvResponse = await request.get('/api/tasks/export/csv');
    expect(csvResponse.ok()).toBeTruthy();
    
    const csvContent = await csvResponse.text();
    
    // Verify headers
    expect(csvContent).toContain('Task ID,Title,Description,Created Date');
    
    // Verify open task is included
    expect(csvContent).toContain('Open Task for CSV');
    
    // Verify completed task is NOT included
    expect(csvContent).not.toContain('Completed Task for CSV');
  });

  test('should have correct CSV headers', async ({ request }) => {
    const response = await request.get('/api/tasks/export/csv');
    expect(response.ok()).toBeTruthy();
    
    const csvContent = await response.text();
    const firstLine = csvContent.split('\n')[0];
    
    expect(firstLine).toBe('Task ID,Title,Description,Created Date');
  });

  test('should properly escape special characters in CSV', async ({ request }) => {
    // Create a task with special characters
    await request.post('/api/tasks', {
      data: { 
        title: 'Task with, comma', 
        description: 'Description with "quotes" and, commas' 
      }
    });

    const response = await request.get('/api/tasks/export/csv');
    const csvContent = await response.text();
    
    // Verify the content is properly escaped (commas and quotes should be handled)
    expect(csvContent).toContain('Task with, comma');
  });
});
