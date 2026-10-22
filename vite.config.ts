import react from '@vitejs/plugin-react';
import macros from 'unplugin-macros/vite';
import type { UserConfig } from 'vite';

import manifest from './build/plugins/manifest.ts';
import prerender from './build/plugins/prerender.ts';
import { prerenderOutDir } from './build/plugins/prerender.ts';

export default {
  builder: {
    async buildApp(builder) {
      await builder.build(builder.environments.prerender);
      await builder.build(builder.environments.client);
    },
  },

  plugins: [
    macros(),
    react(),

    prerender({
      input: './popup/popup.prerender.tsx',
      output: 'popup.html',
      runtime: './popup/popup.runtime.tsx',
    }),

    manifest({
      backgroundScript: './background.ts',
      backgroundWorker: './background.ts',
      popup: 'popup.html',
    }),
  ],

  input: {
    background: './background.ts',
    popup: './popup/popup.runtime.tsx',
  },

  environments: {
    prerender: {
      build: {
        target: 'esnext',
        ssr: './popup/popup.prerender.tsx',
        outDir: prerenderOutDir,
        emptyOutDir: false,
        copyPublicDir: false,
      },
    },
  },

  publicDir: 'resources',
  resolve: { tsconfigPaths: true },
} satisfies UserConfig;
