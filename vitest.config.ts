import { defineConfig } from 'vitest/config';

// Separate from vite.config.ts so tests don't run the build plugins.
export default defineConfig({
  test: {
    include: ['**/*.spec.ts'],
    setupFiles: ['@webext-core/fake-browser/auto'],
    restoreMocks: true,
    unstubGlobals: true,
    env: { CDN: 'https://cdn.test/base/' },
  },
  resolve: { tsconfigPaths: true },
});
