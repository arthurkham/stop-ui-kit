import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: [
      'packages/*',
      { test: { name: 'tooling', include: ['tooling/*.test.ts'], environment: 'node' } },
    ],
  },
});
