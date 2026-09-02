import { test, expect } from '@playwright/test';

test('главная показывает форму поиска и список рейсов', async ({ page }) => {
  const consoleErrors: string[] = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  await page.goto('/');

  // Форма поиска
  await expect(page.getByTestId('flight-search-form')).toBeVisible();

  // Города загружены и при выборе города есть опции
  const originSelect = page.getByTestId('search-origin');
  const destinationSelect = page.getByTestId('search-destination');

  await expect(originSelect.locator('option')).not.toHaveCount(0);
  await expect(destinationSelect.locator('option')).not.toHaveCount(0);

  // Список рейсов появился автоматически
  await expect(page.getByTestId('flight-results')).toBeVisible();
  await expect(page.getByTestId('flight-result-item')).not.toHaveCount(0);

  // В карточке рейса есть кнопка "Забронировать"
  await expect(page.getByTestId('book-flight').first()).toBeVisible();

  // При отправке формы мок возвращает данные
  await page.getByTestId('search-submit').click();
  await expect(page.getByTestId('flight-results')).toBeVisible();
  await expect(page.getByTestId('flight-result-item')).not.toHaveCount(0);

  // Ошибок в консоли нет
  expect(consoleErrors).toEqual([]);
});