import { defineConfig } from 'vitest/config';

// Separate from vite.config.ts so tests don't run the build plugins.
export default defineConfig({
  test: {
    include: ['lib/**/*.spec.ts'],
    restoreMocks: true,
  },
});
