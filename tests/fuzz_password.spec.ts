import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

const baseURL = 'https://7sffsjcgsu.ap-southeast-1.awsapprunner.com/signup'; // adjust to your dev server

// Generate both valid and invalid passwords to fuzz the SignupForm logic
const passwordCases = [
  '',                                      // empty
  'short1A',                               // too short
  'alllowercase1',                         // no uppercase
  'ALLUPPERCASE1',                         // no lowercase
  'NoNumbersHere',                         // no numbers
  'ValidPass1',                             // valid basic
  '123456789',                             // only numbers
  faker.internet.password({ length: 50 }), // long random valid
  faker.internet.password({ length: 8 }),
  faker.internet.password({ length: 199 }),

  'Aa1!@#$',                                // valid min length with special chars
  'Abcdefgh1',                              // valid
];

test.describe('SignupForm password fuzz test', () => {

  for (let i = 0; i < passwordCases.length; i++) {
  const pwd = passwordCases[i];
  test(`Password fuzz case #${i + 1}`, async ({ page }) => {
    await page.goto(baseURL);

      // Fill required other fields with dummy valid data
      await page.fill('#name', faker.person.firstName());
      await page.fill('#email', faker.internet.email());
      await page.fill('#phoneNumber', faker.phone.number({ style: 'national' }));

      // Password & confirm password (same as password for now)
      await page.fill('#password', pwd);
      await page.fill('#confirmPassword', pwd);

      // Give React validation useEffect time to run
      await page.waitForTimeout(200);

      const errorList = page.locator('ul.text-red-500 li');
      const errorCount = await errorList.count();
      const isErrorPresent = errorCount > 0;

      // Debug output for visibility
      console.log(`Password "${pwd}" → ${errorCount} validation errors`);

      // Check disabled/enabled state of Register button
      const isDisabled = await page.locator('button:has-text("Register")').isDisabled();

      if (
        pwd.length >= 8 &&
        /[A-Z]/.test(pwd) &&
        /[a-z]/.test(pwd) &&
        /[0-9]/.test(pwd)
      ) {
        // Should be valid → no errors and button enabled
        expect(isErrorPresent).toBeFalsy();
        expect(isDisabled).toBeFalsy();
      } else {
        // Should be invalid → at least one error and button disabled
        expect(isErrorPresent).toBeTruthy();
        expect(isDisabled).toBeTruthy();
      }
    });
  }
});
