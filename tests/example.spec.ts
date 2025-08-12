import { test, expect } from '@playwright/test';
async function goToDashboardFromHome(page) {
  await page.goto('http://localhost:8080/');
  await page.click('button:has-text("Get Started")');
  await expect(page).toHaveURL(/\/dashboard$/);
}
test('HomePage image slider cycles and navigation button works', async ({ page }) => {
  // Go to the home page (adjust URL if needed)
  await page.goto('http://localhost:8080/');

  // Verify the first image slide is visible
  const firstImage = page.locator('img[alt="Slide 0"]');
  await expect(firstImage).toHaveCSS('opacity', '1');
  await expect(firstImage).toBeVisible();

  // Wait for the slider to cycle to the second image (after about 6 seconds)
  const secondImage = page.locator('img[alt="Slide 1"]');
  await secondImage.waitFor({ state: 'visible', timeout: 7000 });
  await expect(secondImage).toHaveCSS('opacity', '1', { timeout: 7000 });

  // Click the "Get Started" button
  await page.click('button:has-text("Get Started")');

  // Expect navigation to /dashboard
  await expect(page).toHaveURL(/\/dashboard$/);


});

test.describe('Dashboard Destination Search', () => {
  test.beforeEach(async ({ page }) => {
    // Mock the destination search API
    await page.route('**/api/search/**', route => {
      const fakeResults = [
        { term: 'New York City', uid: 'nyc123', lat: 40.71, lng: -74.0, type: 'city' },
        { term: 'Los Angeles', uid: 'la123', lat: 34.05, lng: -118.24, type: 'city' },
      ];
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(fakeResults),
      });
    });
  });

  test('User can search and navigate to hotels page', async ({ page }) => {
    // Go to dashboard
    await goToDashboardFromHome(page);

    // ==== 1. Select destination ====
    const searchInput = page.locator('[data-testid="async-select"] input');
    await searchInput.fill('New'); // triggers fetch
    await page.waitForTimeout(500); // wait for debounce
    await page.keyboard.press('ArrowDown'); // select first option
    await page.keyboard.press('Enter');

    // ==== 2. Set date range ====
    await page.locator('input[placeholder="Add Dates"]').click();
    // Pick first date and another date 7 days later
    const startDate = page.locator('.rdrDay:not(.rdrDayPassive)', { hasText: '15' }).first();
    const endDate = page.locator('.rdrDay:not(.rdrDayPassive)', { hasText: '22' }).first();
    await startDate.click();
    await endDate.click();

    // ==== 3. Set guests ====
    await page.locator('input[placeholder="Add Guest"]').click();
    // Increase adults
    await page.locator('[data-testid="adult-plus"]').click();
    // Increase children
    await page.locator('[data-testid="children"]').locator('../..').locator('button').nth(1).click();
    // Close guest popup with Done
    await page.getByText('Done').click();

    // ==== 4. Increase room ====
    await page.locator('[data-testid="plus"]').click();

    // ==== 5. Click Search ====
    await page.getByRole('link', { name: 'Search' }).click();

    // ==== 6. Verify redirection ====
    await expect(page).toHaveURL(/\/hotels\?/);
    await expect(page.url()).toContain('location=nyc123');
    await expect(page.url()).toMatch(/adult=1/);
    await expect(page.url()).toMatch(/children=1/);
    await expect(page.url()).toMatch(/room=1/);
  });

  
});


test.describe('Full User Journey: Home → Dashboard → Hotels Listing', () => {
  test.beforeEach(async ({ page }) => {
    // Mock the destination search API
    await page.route('**/api/search/**', route => {
      const fakeResults = [
        { term: 'New York City', uid: 'nyc123', lat: 40.71, lng: -74.0, type: 'city' },
      ];
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(fakeResults) });
    });

    // Mock the hotels listing API
    await page.route('**/api/hotels?destination_id=nyc123', route => {
      const fakeHotels = Array.from({ length: 9 }).map((_, i) => ({
        id: `hotel-${i+1}`,
        name: `Hotel ${i+1}`,
        latitude: 40.71 + i * 0.001,
        longitude: -74.0 - i * 0.001,
        rating: 4,
        amenities: { wifi: true },
        trustyou: { score: { overall: 85 } },
        price: 200 + i * 10
      }));
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(fakeHotels) });
    });

    // Mock the hotel prices polling API
    await page.route('**/api/hotels/prices**', route => {
      const fakePrices = {
        completed: true,
        hotels: Array.from({ length: 9 }).map((_, i) => ({
          id: `hotel-${i+1}`,
          price: 200 + i * 10
        }))
      };
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(fakePrices) });
    });
  });

  test('User completes search and views hotel listings', async ({ page }) => {
    // Step 1: HomePage
    await page.goto('http://localhost:8080/');
    await expect(page.locator('img[alt="Slide 0"]')).toBeVisible();
    await page.click('button:has-text("Get Started")');
    await expect(page).toHaveURL(/\/dashboard$/);

    // Step 2: Select destination
    const searchInput = page.locator('[data-testid="async-select"] input');
    await searchInput.fill('New');
    await page.waitForTimeout(500);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');

    // Step 3: Dates
    await page.locator('input[placeholder="Add Dates"]').click();
    await page.locator('.rdrDay:not(.rdrDayPassive)', { hasText: '15' }).first().click();
    await page.locator('.rdrDay:not(.rdrDayPassive)', { hasText: '22' }).first().click();

    // Step 4: Guests
    await page.locator('input[placeholder="Add Guest"]').click();
    await page.locator('[data-testid="adult"]').evaluate(node => {
      node.parentElement?.querySelector('div.plus')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    await page.locator('[data-testid="children"]').evaluate(node => {
      node.parentElement?.querySelector('div.plus')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    await page.getByText('Done').click();

    // Step 5: Room increase
    await page.locator('[data-testid="plus"]').click();

    // Step 6: Click Search
    await page.getByRole('link', { name: 'Search' }).click();

    // Step 7: Hotels Listing page
    await expect(page).toHaveURL(/\/hotels\?/);
    await expect(page.locator('.list-tent >> text=Hotel')).toHaveCount(8); // first page limit

    // Step 8: Pagination should show (since >8 hotels)
    await expect(page.locator('.pagination')).toBeVisible();

    // Step 9: Apply a sort filter
    await page.locator('select').first().selectOption('priceLowToHigh'); // Assuming <SortSelector> is select

    // Step 10: Verify modal is NOT visible (valid search)
    await expect(page.locator('text=Cannot load hotel prices')).toHaveCount(0);
  });
});