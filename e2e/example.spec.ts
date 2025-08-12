import { test, expect } from '@playwright/test';

test('Booking flow: user enters details and proceeds to checkout', async ({ page }) => {
  // Mock the user session API to simulate logged-in user
  await page.route('http://18.138.130.229:3000/api/users/session', route =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: {
          id: 123,
          name: 'John Doe',
          phone_number: '1234567890',
          email: 'john@example.com',
        },
      }),
    })
  );

  // Define booking data normally passed via React Router location.state
  const bookingState = {
    hotelName: 'Test Hotel',
    roomType: 'Deluxe Suite',
    price: 250,
    startDate: '2025-08-20',
    endDate: '2025-08-22',
    numberOfRooms: 1,
    adults: 2,
    children: 0,
    currency: 'USD',
    hotelImage: 'https://example.com/image.jpg',
  };

  // Intercept the booking POST request and mock its response
  await page.route('http://18.138.130.229:3000/api/bookings', route =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ bookingId: 'abc-123' }),
    })
  );

  // Navigate to booking page with the booking state passed as location state
  // Since Playwright does not natively simulate React Router state, use URL params or localStorage
  // Here we assume that bookingState is encoded in a query param or injected by the app for testing; 
  // you may need to adjust this based on your app's setup.
  await page.goto('http://localhost:3000/booking', { waitUntil: 'networkidle' });

  // Wait for user details form to be visible (means loading done)
  await expect(page.locator('text=Your Details')).toBeVisible();

  // Fill the required user fields (first name, last name, phone, email)
  await page.fill('input[placeholder="First Name"],input[name="firstName"],input#firstName', 'Jane');
  await page.fill('input[placeholder="Last Name"],input[name="lastName"],input#lastName', 'Smith');
  await page.fill('input[placeholder="Phone Number"],input[name="phoneNumber"],input#phoneNumber', '+12345678901');
  await page.fill('input[type="email"],input[placeholder="Email Address"],input[name="email"]', 'jane.smith@example.com');

  // Optionally fill special requests textarea
  await page.fill('textarea', 'Need early check-in');

  // Click the submit button to proceed to checkout
  await page.click('button:has-text("Proceed to Checkout")');

  // Wait for navigation to checkout page with bookingId in state (URL or
})