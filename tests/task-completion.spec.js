const { test, expect } = require('@playwright/test');

test.describe('Task Completion', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should keep checkbox checked after marking task as complete', async ({ page }) => {
    // Add a new task
    const uniqueTitle = `Test task ${Date.now()}`;
    await page.getByRole('textbox', { name: 'Title' }).fill(uniqueTitle);
    await page.getByRole('button', { name: 'Add Task' }).click();

    // Wait for the specific task to be added
    const taskItem = page.locator('.task-item').filter({ hasText: uniqueTitle });
    await expect(taskItem).toBeVisible();

    // Get the checkbox for this specific task
    const checkbox = taskItem.getByRole('checkbox', { name: 'Completed' });

    // Verify checkbox is initially unchecked
    await expect(checkbox).not.toBeChecked();

    // Click the checkbox to mark as complete
    await checkbox.click();

    // Wait a moment for the update to process
    await page.waitForTimeout(500);

    // Verify checkbox stays checked
    await expect(checkbox).toBeChecked();

    // Verify task has completed styling
    await expect(taskItem).toHaveClass(/completed/);
  });

  test('should uncheck checkbox after marking completed task as incomplete', async ({ page }) => {
    // Add a new task
    const uniqueTitle = `Test task ${Date.now()}`;
    await page.getByRole('textbox', { name: 'Title' }).fill(uniqueTitle);
    await page.getByRole('button', { name: 'Add Task' }).click();

    // Wait for the specific task to be added
    const taskItem = page.locator('.task-item').filter({ hasText: uniqueTitle });
    await expect(taskItem).toBeVisible();

    const checkbox = taskItem.getByRole('checkbox', { name: 'Completed' });

    // Mark task as complete
    await checkbox.click();
    await page.waitForTimeout(500);
    await expect(checkbox).toBeChecked();

    // Uncheck the task
    await checkbox.click();
    await page.waitForTimeout(500);

    // Verify checkbox is unchecked
    await expect(checkbox).not.toBeChecked();

    // Verify task does not have completed styling
    await expect(taskItem).not.toHaveClass(/completed/);
  });
});
