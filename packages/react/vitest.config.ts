import { defineProject } from 'vitest/config';

export default defineProject({
  test: {
    name: 'react',
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    restoreMocks: true,
  },
});
