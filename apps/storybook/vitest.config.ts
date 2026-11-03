import { join } from 'node:path';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

type BrowserName = 'chromium' | 'firefox' | 'webkit';

// Every story runs as a test in real browsers and in every theme: it must render without errors
// and pass the accessibility checks (the a11y addon fails on violations, including contrast).
// Narrow the run locally, e.g. `BROWSERS=chromium THEMES=dark pnpm test:browser`.
const list = (value: string | undefined, fallback: string) =>
  (value ?? fallback).split(',').map((item) => item.trim());

const browsers = list(process.env.BROWSERS, 'chromium,firefox,webkit') as BrowserName[];
const themes = list(process.env.THEMES, 'light,dark');

export default defineConfig({
  plugins: [storybookTest({ configDir: join(import.meta.dirname, '.storybook') })],
  test: {
    projects: themes.map((theme) => ({
      extends: true,
      define: { __STORYBOOK_THEME__: JSON.stringify(theme) },
      test: {
        name: `storybook (${theme})`,
        browser: {
          enabled: true,
          headless: true,
          provider: playwright(),
          instances: browsers.map((browser) => ({ browser })),
        },
        setupFiles: ['./.storybook/vitest.setup.ts'],
      },
    })),
  },
});
