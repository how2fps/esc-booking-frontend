import { test, expect } from '@playwright/test';

async function goToDashboardFromHome(page) {
  await page.goto('https://7sffsjcgsu.ap-southeast-1.awsapprunner.com/');
  await page.click('button:has-text("Get Started")');
  await expect(page).toHaveURL(/\/dashboard$/);
}

test('HomePage image slider cycles and navigation button works (Live)', async ({ page }) => {
  await page.goto('https://7sffsjcgsu.ap-southeast-1.awsapprunner.com/');

  // Wait for the first slide
  const firstImage = page.locator('img[alt="Slide 0"]');
  await expect(firstImage).toBeVisible();

  // Wait for slider to change (approx. 6-7 seconds)
  const secondImage = page.locator('img[alt="Slide 1"]');
  await secondImage.waitFor({ state: 'visible', timeout: 8000 });

  // Click "Get Started"
  await page.click('button:has-text("Get Started")');
  await expect(page).toHaveURL(/\/dashboard$/);
});

test.describe('Dashboard Destination Search (Live)', () => {
  test('User can search and navigate to hotels page with live API', async ({ page }) => {
    await goToDashboardFromHome(page);

    // ==== 1. Destination search ====
    const searchInput = page.locator('[data-testid="async-select"] input');
    await searchInput.fill('New'); // should match actual destinations
    await page.waitForTimeout(1000);

    // Press down and enter to select first suggestion
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');

    // ==== 2. Date range ====
    await page.locator('input[placeholder="Add Dates"]').click();
    // Pick today + 7 days later
    const today = new Date();
    const startDay = today.getDate();
    const endDay = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).getDate();

    await page.locator(`.rdrDay:not(.rdrDayPassive):has-text("${startDay}")`).first().click();
    await page.locator(`.rdrDay:not(.rdrDayPassive):has-text("${endDay}")`).first().click();

    // ==== 3. Guests ====
    await page.locator('input[placeholder="Add Guest"]').click();
    await page.locator('[data-testid="adult-plus"]').click();
    await page.locator('[data-testid="children-plus"]').click();
    await page.getByText('Done').click();

    // ==== 4. Room increase ====
    await page.locator('[data-testid="plus"]').click();

    // ==== 5. Search ====
    await page.getByRole('link', { name: 'Search' }).click();

    // ==== 6. Verify navigation ====
    await expect(page).toHaveURL(/\/hotels\?/);
    await expect(page.locator('.list-tent')).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Full Live User Journey', () => {
  test('Home → Dashboard → Hotels Listing (Live)', async ({ page }) => {
    // Step 1: From homepage to dashboard
    await page.goto('https://7sffsjcgsu.ap-southeast-1.awsapprunner.com/');
    await expect(page.locator('img[alt="Slide 0"]')).toBeVisible();
    await page.click('button:has-text("Get Started")');
    await expect(page).toHaveURL(/\/dashboard$/);

    // Step 2: Destination search
    const searchInput = page.locator('[data-testid="async-select"] input');
    await searchInput.fill('New');
    await page.waitForTimeout(1000);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');

    // Step 3: Dates
    await page.locator('input[placeholder="Add Dates"]').click();
    const startDay = new Date().getDate();
    const endDay = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).getDate();
    await page.locator(`.rdrDay:not(.rdrDayPassive):has-text("${startDay}")`).first().click();
    await page.locator(`.rdrDay:not(.rdrDayPassive):has-text("${endDay}")`).first().click();

    // Step 4: Guests
    await page.locator('input[placeholder="Add Guest"]').click();
    await page.locator('[data-testid="adult-plus"]').click();
    await page.locator('[data-testid="children-plus"]').click();
    await page.getByText('Done').click();

    // Step 5: Rooms
    await page.locator('[data-testid="plus"]').click();

    // Step 6: Search
    await page.getByRole('link', { name: 'Search' }).click();

    // Step 7: Hotels Listing
    await expect(page).toHaveURL(/\/hotels\?/);
    await expect(page.locator('.list-tent')).toBeVisible({ timeout: 10000 });

    // Step 8: Sort dropdown
    const sortSelect = page.locator('select#sort');
    await expect(sortSelect).toBeVisible({ timeout: 10000 });
    await sortSelect.selectOption('priceLowToHigh');
    await expect(sortSelect).toHaveValue('priceLowToHigh');
  });
});

test.describe('Hotel listing to detail navigation (Live)', () => {
  test('Clicking a hotel navigates to details', async ({ page }) => {
    // Navigate directly to hotels page pre-filled from a real search
    await page.goto('https://7sffsjcgsu.ap-southeast-1.awsapprunner.com/');
    await page.click('button:has-text("Get Started")');
    const searchInput = page.locator('[data-testid="async-select"] input');
    await searchInput.fill('New');
    await page.waitForTimeout(1000);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await page.locator('input[placeholder="Add Dates"]').click();
    const startDay = new Date().getDate();
    const endDay = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).getDate();
    await page.locator(`.rdrDay:not(.rdrDayPassive):has-text("${startDay}")`).first().click();
    await page.locator(`.rdrDay:not(.rdrDayPassive):has-text("${endDay}")`).first().click();
    await page.getByRole('link', { name: 'Search' }).click();

    // Wait for hotels to load
    const hotels = page.locator('.list-tent');
    await expect(hotels.first()).toBeVisible({ timeout: 15000 });

    // Click first visible hotel
    const firstHotelName = await hotels.first().innerText();
    await hotels.first().click();

    // Verify we land on details page
    await expect(page).toHaveURL(/\/hotels\//);
    await expect(page.getByRole('heading', { level: 1, name: firstHotelName })).toBeVisible();

    // Change date range in detail page
    await page.getByText('Check In').click();
    const dp = page.locator('.form-date-picker');
    await expect(dp).toBeVisible();
    await dp.locator(`.rdrDay:not(.rdrDayPassive):has-text("${startDay}")`).first().click();
    await dp.locator(`.rdrDay:not(.rdrDayPassive):has-text("${endDay}")`).first().click();
  });
});
  