const { test, expect } = require('@playwright/test');

test('task completion stays checked', async ({ page }) => {
  await page.goto('/');

  const taskTitle = `Complete task ${Date.now()}`;
  await page.fill('#task-title', taskTitle);
  await page.fill('#task-description', 'Check completion state');
  await page.click('button[type="submit"]');

  const taskItem = page.locator('.task-item', { hasText: taskTitle });
  const checkbox = taskItem.locator('.task-checkbox');

  await expect(taskItem).toBeVisible();
  await checkbox.check();
  await expect(checkbox).toBeChecked();
  await expect(taskItem).toHaveClass(/completed/);

  await page.reload();

  const reloadedCheckbox = page.locator('.task-item', { hasText: taskTitle }).locator('.task-checkbox');
  await expect(reloadedCheckbox).toBeChecked();
});
