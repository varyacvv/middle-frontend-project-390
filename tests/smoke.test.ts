import { test, expect } from '@playwright/test';

test('главная страница открывается и показывает заголовок', async ({ page }) => {
  // Массив для сбора ошибок из консоли
  const consoleErrors: string[] = [];

  // Ошибки консоли
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  // Переходим на главную
  await page.goto('/');

  // Проверяем, что заголовок h1 существует и не пустой
  const heading = page.locator('h1');
  await expect(heading).toHaveCount(1);
  await expect(heading).not.toHaveText('');

  // Убеждаемся, что ошибок в консоли не было
  expect(consoleErrors).toEqual([]);
});