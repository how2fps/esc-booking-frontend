import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

const baseURL = 'ttp://localhost:8080/dashboard';  // Change to your dev server

test.describe('DestinationSearch fuzz test', () => {

  const randomInt = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const fuzzIterations = 10; // how many times to run

  for (let i = 0; i < fuzzIterations; i++) {
    test(`Fuzz iteration ${i + 1}`, async ({ page }) => {
      await page.goto('https://7sffsjcgsu.ap-southeast-1.awsapprunner.com/dashboard', { waitUntil: 'load' });

      // ---- DESTINATION SEARCH ----
      const searchQuery = faker.location.city(); // random city name
      await page.getByTestId('async-select').click();
      await page.keyboard.type(searchQuery);
      await page.waitForTimeout(500); // wait for debounce & API

      // Select first option if available
      const options = page.locator('.select__menu-list div').first();
      if (await options.count() > 0) {
        await options.click();
      }

      // ---- DATE RANGE ----
      
      await page.locator('input[placeholder="Add Dates"]').click();
      // Pick first date and another date 7 days later
      const first = randomInt(1, 28)
      const startDate = page.locator('.rdrDay:not(.rdrDayPassive)', { hasText: first.toString() }).first();
      const endDate = page.locator('.rdrDay:not(.rdrDayPassive)', { hasText: (first+randomInt(1, 9)).toString()}).first();
      await startDate.click();
      await endDate.click();
      // You can simulate by clicking on start and end date in calendar
      // Here just toggle the picker
  
      await page.waitForTimeout(300);

      // ---- GUESTS ----
      const addAdults = randomInt(0, 5);
      const addChildren = randomInt(0, 5);
      const addRooms = randomInt(1, 3);

      


      await page.locator('input[placeholder="Add Guest"]').click();
    // Increase adults
    const adultPlus = page.locator('[data-testid="adult-plus"]');
    for (let a = 0; a < addAdults; a++) {
        await adultPlus.click();
      }
    const childPlus = page.locator('[data-testid="children-plus"]');
    await expect(childPlus).toBeVisible();
    for (let c = 0; c < addChildren; c++) {
        await childPlus.click();
      }
    
      for (let r = 0; r < addRooms; r++) {
        await page.locator('[data-testid="plus"]').click();

      }
    
    
    
       await page.getByText('Done').click();
      // ---- SUBMIT ----
      await page.getByRole('link', { name: 'Search' }).click();

      // ---- VALIDATE ----
      const url = page.url();
      expect(url).toContain('adult=' + addAdults);
      expect(url).toContain('children=' + addChildren);
      expect(url).toContain('room=' + addRooms);

      console.log(`[Fuzz ${i + 1}] Search="${searchQuery}" Adults=${addAdults} Children=${addChildren} Rooms=${addRooms} => ${url}`);
    });
  }
});
