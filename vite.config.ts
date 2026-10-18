import type { UserConfig } from 'vite';

import manifest from './build/plugins/manifest.ts';

export default {
  plugins: [
    manifest({
      backgroundScript: './background.ts',
      backgroundWorker: './background.ts',
    }),
  ],

  input: {
    background: './background.ts',
  },

  publicDir: 'resources',
  resolve: { tsconfigPaths: true },
} satisfies UserConfig;
