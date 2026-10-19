import macros from 'unplugin-macros/vite';
import type { UserConfig } from 'vite';

import manifest from './build/plugins/manifest.ts';

export default {
  plugins: [
    macros(),
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
