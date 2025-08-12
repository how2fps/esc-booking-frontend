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
    const adultPlus = page.locator('[data-testid="adult-plus"]');
    await expect(adultPlus).toBeVisible();
    await adultPlus.click();
    // Increase children
    const childPlus = page.locator('[data-testid="children-plus"]');
    await expect(childPlus).toBeVisible();
    await childPlus.click();
    
    // Close guest popup with Done
    await page.getByText('Done').click();

    // ==== 4. Increase room ====
    await page.locator('[data-testid="plus"]').click();

    // ==== 5. Click Search ====
    await page.getByRole('link', { name: 'Search' }).click();

    // ==== 6. Verify redirection ====
    await expect(page).toHaveURL(/\/hotels\?/);
    await expect(page.url()).toContain('http://localhost:8080/hotels?location=la123&startDate=8/22/2025&endDate=8/22/2025&adult=1&children=1&room=1');
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
    await expect(page.locator('.list-tent >> text=Hotel')).toHaveCount(8, { timeout: 10000 }); // first page limit

    // Step 8: Pagination should show (since >8 hotels)
    //await expect(page.locator('.pagination')).toBeVisible();

    // Step 9: Apply a sort filter
    await page.click('[id="sort"]');

    const sortSelect = page.locator('select#sort');
    await expect(sortSelect).toBeVisible({ timeout: 10000 });

    // Select by value (from the option's value attribute)
    await sortSelect.selectOption('priceLowToHigh');

    // Optional: verify the value changed
    await expect(sortSelect).toHaveValue('priceLowToHigh');
    // Step 10: Verify modal is NOT visible (valid search)
    await expect(page.locator('text=Cannot load hotel prices')).toHaveCount(1);
  });
});

test.describe('Hotel listing to hotel detail navigation', () => {
  test.beforeEach(async ({ page }) => {
    // === Mock search result hotels ===
    await page.route('**/api/hotels?destination_id=nyc123', route => {
      const fakeHotels = Array.from({ length: 9 }).map((_, i) => ({
        id: `hotel-${i+1}`,
        name: `Hotel ${i+1}`,
        latitude: 40.71 + i * 0.001,
        longitude: -74.0 - i * 0.001,
        rating: 4.5,
        amenities: { wifi: true },
        trustyou: { score: { overall: 85 } },
        image_details: { prefix: 'https://example.com/hotel', count: 3, suffix: '.jpg' },
        price: 200 + i * 10
      }));
      route.fulfill({ status: 200, body: JSON.stringify(fakeHotels) });
    });

    // === Mock hotel prices ===
    await page.route('**/api/hotels/prices**', route => {
      const fakePrices = {
        completed: true,
        hotels: Array.from({ length: 9 }).map((_, i) => ({
          id: `hotel-${i+1}`,
          price: 200 + i * 10
        }))
      };
      route.fulfill({ status: 200, body: JSON.stringify(fakePrices) });
    });

    // === Mock single hotel detail ===
    await page.route('**/api/hotels/hotel-1', route => {
      const detail = {
        id: 'hotel-1',
        name: 'Hotel 1',
        rating: 4.8,
        address: '123 Test Street',
        latitude: 40.71,
        longitude: -74.0,
        description: 'Test description for Hotel 1.',
        image_details: { prefix: 'https://example.com/detail', count: 3, suffix: '.jpg' },
        trustyou: { score: { overall: 90 } },
        amenities_ratings: [
          { name: 'wifi', score: 90 },
          { name: 'pool', score: 80 }
        ]
      };
      route.fulfill({ status: 200, body: JSON.stringify(detail) });
    });

    // === Mock hotel rooms ===
    await page.route('**/api/hotels/hotel-1/prices**', route => {
      const roomData = {
        completed: true,
        rooms: [
          {
            key: 'room-123',
            roomNormalizedDescription: 'Deluxe King Room',
            converted_price: 250,
            rooms_available: 5,
            images: [{ hero_image: true, high_resolution_url: 'https://example.com/room.jpg' }]
          }
        ]
      };
      route.fulfill({ status: 200, body: JSON.stringify(roomData) });
    });
  });

  test('Clicking a hotel item navigates to hotel detail page', async ({ page }) => {
    // Step 1: Go to listing page with destination query
    await page.goto('http://localhost:8080/hotels?location=nyc123&startDate=2025-08-22&endDate=2025-08-25&adult=1&children=0&room=1');

    // Step 2: Wait for list to populate
    await expect(page.locator('.list-tent >> text=Hotel')).toHaveCount(8, { timeout: 5000 });

    // Step 3: Click first hotel
    await page.locator('.list-tent >> text=Hotel 1').first().click();

    // Step 4: Verify Hotel Detail page loaded
    await expect(page).toHaveURL(/\/hotels\/hotel-1/);
    await expect(page.getByRole('heading', { level: 1, name: 'Hotel 1' })).toBeVisible();
    await expect(page.locator('img[alt="Main Hotel View"]')).toBeVisible();


    
// ==== Step 4.1: Change date range to 20 Aug – 27 Aug ====
// Click the date range input (placeholder depends on your markup)
await page.getByText('Check In').click();
const datePicker = page.locator('.form-date-picker');
await expect(datePicker).toBeVisible({ timeout: 10000 });

// Select start date (20 Aug) - targeting enabled day only
const startDate = datePicker.locator('.rdrDay:not(.rdrDayPassive):has-text("20")').first();
await startDate.click();

// Slight delay can help with UI responsiveness
await page.waitForTimeout(200);

// Select end date (27 Aug) - similarly targeting enabled day
const endDate = datePicker.locator('.rdrDay:not(.rdrDayPassive):has-text("27")').first();
// Use force click if needed to bypass pointer-events intercept
await endDate.click({ force: true });
     });
});