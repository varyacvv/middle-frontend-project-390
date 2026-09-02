import { test, expect } from '@playwright/test';

test('оформление бронирования', async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  await page.goto('/booking/fl_1');

  await expect(page.getByTestId('booking-flight')).toBeVisible();

  await page.getByTestId('contact-email').fill('test@example.com');
  await page.getByTestId('contact-phone').fill('+79991234567');

  await page.getByTestId('passenger-0-firstName').fill('Иван');
  await page.getByTestId('passenger-0-lastName').fill('Петров');
  await page.getByTestId('passenger-0-dob').fill('1990-05-20');
  await page.getByTestId('passenger-0-document').fill('4509 123456');

  await page.getByTestId('booking-submit').click();

  await expect(page.getByTestId('booking-success')).toBeVisible();
  await expect(page.getByTestId('booking-code')).not.toHaveText('');

  expect(consoleErrors).toEqual([]);
});

test('рейс не найден', async ({ page }) => {
  // Перехватываем запрос и возвращаем 404
  await page.route('**/api/flights/unknown_id', (route) =>
    route.fulfill({
      status: 404,
      contentType: 'application/json',
      body: JSON.stringify({ code: 'not_found', message: 'Не найдено' }),
    })
  );

  await page.goto('/booking/unknown_id');

  // Проверяем, что показывается состояние "рейс не найден"
  await expect(page.getByTestId('flight-not-found')).toBeVisible();
});