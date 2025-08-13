import { test, expect } from '@playwright/test';

const BASE_URL = 'https://7sffsjcgsu.ap-southeast-1.awsapprunner.com'; // change to your app URL
const TEST_EMAIL = 'weiyang@gmail.com'; // use a valid test user
const TEST_PASSWORD = 'P@ssw0rd';     // matching that account

test.describe('Login flow from dashboard redirection', () => {

  test('should redirect to login, authenticate, and return to dashboard', async ({ page }) => {

    // 1. Go directly to dashboard
    await page.goto(`${BASE_URL}/dashboard`);

    // 2. Expect to be redirected to login (because unauthenticated)
    await expect(page).toHaveURL(/\/login$/);

    // 3. Fill email & password
    await page.fill('#username', TEST_EMAIL);
    await page.fill('#password', TEST_PASSWORD);

    // 4. Click Login
    await page.click('button:has-text("Login")');

    // 5. Wait for navigation back to dashboard
    await page.waitForURL(`${BASE_URL}/dashboard`, { timeout: 10000 });

    // 6. Validate the dashboard content is visible
    //    Adapt the selector below to match something unique to your dashboard
    await expect(page.locator('[data-testid="dashboard-header"]')).toBeVisible();

    // 7. Optional — verify that some user-specific data is displayed
    //    e.g. greeting message
    // await expect(page.locator('text=Welcome, Test User')).toBeVisible();
  });

});

// An array of invalid email/password combinations for fuzzing
const invalidCredentials = [
  { email: '', password: '' },                               // empty both
  { email: ' ', password: ' ' },                             // whitespace
  { email: 'invalidemail', password: 'password123' },        // no @
  { email: 'user@example.com', password: '' },               // empty password
  { email: '', password: 'Valid123' },                       // empty email
  { email: 'notfound@example.com', password: 'Valid123' },   // unknown email
  { email: 'test@example.com', password: 'wrongpass' },      // wrong password
  { email: 'test@example.com', password: '   ' },            // spaces password
  { email: 'test@example.com', password: '"); DROP TABLE users;--' }, // SQLi attempt
  { email: 'abc@xyz.com', password: '<script>alert(1)</script>' }     // XSS attempt
];

test.describe('Fuzz test - Failed Login Attempts', () => {

  for (const [i, creds] of invalidCredentials.entries()) {
    test(`Fail login case #${i + 1}`, async ({ page }) => {
      // Go to login page
      await page.goto(`${BASE_URL}/login`);

      // Fill email
      await page.fill('#username', creds.email);
      // Fill password
      await page.fill('#password', creds.password);

      // Click login
      await page.click('button:has-text("Login")');

      // Wait briefly for request & UI update
      await page.waitForTimeout(500);

      // Assert: Still on /login (no redirect to /dashboard)
      await expect(page).toHaveURL(/\/login$/);

      // Assert: Error message is shown
      const errorMessage = page.locator('.text-red-500');
      await expect(errorMessage).toBeVisible();

      // Debug output
      console.log(
        `Case ${i + 1}: email="${creds.email}" password="${creds.password}" → error="${await errorMessage.textContent()}"`
      );
    });
  }
});
