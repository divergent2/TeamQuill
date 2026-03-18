import { test, expect } from '@playwright/test';

test.describe('TeamQuill E2E Tests', () => {
  const testEmail = `test-${Date.now()}@teamquill.test`;
  const testPassword = 'TestPassword123!';

  test('complete user flow: signup -> login -> create task -> update status -> verify notification', async ({ page }) => {
    // Step 1: Navigate to signup page
    await page.goto('/signup');
    await expect(page).toHaveTitle(/TeamQuill/);

    // Step 2: Sign up with test credentials
    await page.getByTestId('signup-email-input').fill(testEmail);
    await page.getByTestId('signup-password-input').fill(testPassword);
    await page.getByTestId('signup-confirm-password-input').fill(testPassword);
    await page.getByTestId('signup-button').click();

    // Should redirect to dashboard after signup
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByText('TeamQuill Dashboard')).toBeVisible();

    // Step 3: Create a new task
    await page.getByTestId('task-title-input').fill('Test Task for E2E');
    await page.getByTestId('task-description-input').fill('This is a test task description');
    await page.getByTestId('create-task-button').click();

    // Wait for task to appear
    await expect(page.getByTestId('task-card')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Test Task for E2E')).toBeVisible();

    // Step 4: Wait for notification about task creation
    // The cloud function should create a notification
    await page.waitForTimeout(3000); // Wait for cloud function to trigger

    // Check notifications
    await page.getByTestId('notification-button').click();
    await expect(page.getByTestId('notifications-panel')).toBeVisible();

    // Verify notification exists
    const notificationExists = await page.getByTestId('notification-item').count();
    expect(notificationExists).toBeGreaterThan(0);

    // Step 5: Update task status
    const statusSelect = page.getByTestId('task-status-select').first();
    await statusSelect.selectOption('in-progress');

    // Wait for status update notification
    await page.waitForTimeout(3000);

    // Step 6: Verify new notification for status change
    // Click notification button to refresh
    await page.getByTestId('notification-button').click();
    await page.getByTestId('notification-button').click();

    // Should have at least 2 notifications now (created + status change)
    const finalNotificationCount = await page.getByTestId('notification-item').count();
    expect(finalNotificationCount).toBeGreaterThanOrEqual(2);

    // Step 7: Mark notification as read by clicking
    await page.getByTestId('notification-item').first().click();

    // Step 8: Logout
    await page.getByTestId('logout-button').click();
    await expect(page).toHaveURL(/\/login/);

    // Step 9: Login again with same credentials
    await page.getByTestId('email-input').fill(testEmail);
    await page.getByTestId('password-input').fill(testPassword);
    await page.getByTestId('login-button').click();

    // Should be back on dashboard
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByText('Test Task for E2E')).toBeVisible();
  });

  test('login with demo credentials', async ({ page }) => {
    await page.goto('/login');

    await page.getByTestId('email-input').fill('demo@teamquill.test');
    await page.getByTestId('password-input').fill('TeamQuill123!');
    await page.getByTestId('login-button').click();

    // Should redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
    await expect(page.getByText('TeamQuill Dashboard')).toBeVisible();
  });
});
