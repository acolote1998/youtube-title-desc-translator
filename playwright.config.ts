import { defineConfig } from '@playwright/test';

export default defineConfig({
  timeout: 600_000,
  use: {
    headless: false,
    locale: 'es-ES',
    viewport: { width: 1280, height: 720 },
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
});
