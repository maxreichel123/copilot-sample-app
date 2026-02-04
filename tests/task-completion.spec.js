const { test, expect } = require('@playwright/test');

test('task completion stays checked', async ({ page }) => {
  await page.goto('/');

  await page.fill('#task-title', `Complete task ${Date.now()}`);
  await page.fill('#task-description', 'Check completion state');
  await page.click('button[type="submit"]');

  const firstTask = page.locator('.task-item').first();
  const checkbox = firstTask.locator('.task-checkbox');

  await checkbox.check();
  await expect(checkbox).toBeChecked();
});
