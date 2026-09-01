import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  use: {
    browserName: 'chromium',
    headless: true,
    baseURL: process.env.APP_URL || 'http://localhost:5173',
  },
});