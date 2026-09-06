import { test, expect } from '@playwright/test';

test('просмотр и отмена брони', async ({ page }) => {
  // Подменяем GET
  await page.route('**/api/bookings/ABC123?lastName=*', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        code: 'ABC123',
        status: 'confirmed',
        flight: {
          id: 'fl_1',
          flightNumber: 'SU1234',
          airline: { code: 'SU', name: 'Аэрофлот' },
          origin: { code: 'MOW', name: 'Москва', country: 'Россия' },
          destination: { code: 'LED', name: 'Санкт-Петербург', country: 'Россия' },
          departureAt: '2026-07-01T08:00:00Z',
          arrivalAt: '2026-07-01T09:25:00Z',
          durationMinutes: 85,
          price: { amount: 5400, currency: 'RUB' },
          seatsAvailable: 42,
        },
        passengers: [
          {
            firstName: 'Иван',
            lastName: 'Петров',
            dateOfBirth: '1990-05-20',
            documentNumber: '4509 123456',
          },
        ],
        contact: { email: 'ivan@example.com', phone: '+79991234567' },
        totalPrice: { amount: 5400, currency: 'RUB' },
        createdAt: '2026-06-25T12:00:00Z',
      }),
    });
  });

  // Подменяем POST
  await page.route('**/api/bookings/ABC123/cancel', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        code: 'ABC123',
        status: 'cancelled',
        flight: {
          id: 'fl_1',
          flightNumber: 'SU1234',
          airline: { code: 'SU', name: 'Аэрофлот' },
          origin: { code: 'MOW', name: 'Москва', country: 'Россия' },
          destination: { code: 'LED', name: 'Санкт-Петербург', country: 'Россия' },
          departureAt: '2026-07-01T08:00:00Z',
          arrivalAt: '2026-07-01T09:25:00Z',
          durationMinutes: 85,
          price: { amount: 5400, currency: 'RUB' },
          seatsAvailable: 42,
        },
        passengers: [
          {
            firstName: 'Иван',
            lastName: 'Петров',
            dateOfBirth: '1990-05-20',
            documentNumber: '4509 123456',
          },
        ],
        contact: { email: 'ivan@example.com', phone: '+79991234567' },
        totalPrice: { amount: 5400, currency: 'RUB' },
        createdAt: '2026-06-25T12:00:00Z',
      }),
    });
  });

  await page.goto('/viewbooking');

  await page.getByTestId('lookup-code').fill('ABC123');
  await page.getByTestId('lookup-lastName').fill('Петров');
  await page.getByTestId('lookup-submit').click();

  await expect(page.getByTestId('booking-details')).toBeVisible();
  await expect(page.getByTestId('booking-code')).toHaveText('ABC123');
  await expect(page.getByTestId('booking-status')).toHaveAttribute('data-status', 'confirmed');
  await expect(page.getByTestId('cancel-booking')).toBeVisible();

  await page.getByTestId('cancel-booking').click();
  await expect(page.getByTestId('booking-status')).toHaveAttribute('data-status', 'cancelled');
  await expect(page.getByTestId('cancel-booking')).toHaveCount(0);
});

test('бронь не найдена', async ({ page }) => {
  await page.route('**/api/bookings/UNKNOWN?lastName=*', (route) => {
    route.fulfill({
      status: 404,
      contentType: 'application/json',
      body: JSON.stringify({ code: 'not_found', message: 'Бронь не найдена' }),
    });
  });

  await page.goto('/viewbooking');
  await page.getByTestId('lookup-code').fill('UNKNOWN');
  await page.getByTestId('lookup-lastName').fill('Петров');
  await page.getByTestId('lookup-submit').click();

  await expect(page.getByTestId('booking-not-found')).toBeVisible();
});