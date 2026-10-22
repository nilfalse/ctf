import react from '@vitejs/plugin-react';
import compilecat from 'compilecat/vite';
import macros from 'unplugin-macros/vite';
import type { UserConfig } from 'vite';
import checker from 'vite-plugin-checker';

import manifest from './build/plugins/manifest.ts';
import prerender from './build/plugins/prerender.ts';
import { prerenderOutDir } from './build/plugins/prerender.ts';

const define: Record<string, string> = {};
switch (process.env.FEATURE_PAGE_ACTION) {
  case '0':
    define['typeof browser.pageAction'] = JSON.stringify('undefined');
    break;
  case '1':
    define['typeof browser.pageAction'] = JSON.stringify('function');
    break;
}
switch (process.env.FEATURE_DNS) {
  case '1':
    define['typeof browser.dns'] = JSON.stringify('object');
    break;
  default:
    define['typeof browser.dns'] = JSON.stringify('undefined');
    break;
}

export default {
  builder: {
    async buildApp(builder) {
      await builder.build(builder.environments.prerender);
      await builder.build(builder.environments.client);
    },
  },

  plugins: [
    checker({ typescript: { buildMode: true } }),
    macros(),
    compilecat({ include: [/\.[jt]sx?$/], exclude: [/node_modules/] }),
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
  build: {
    target: ['chrome148', 'firefox121'],
    assetsDir: '.',
    minify: false,
    rolldownOptions: {
      output: {
        chunkFileNames(chunk) {
          return chunk.name === 'rolldown-runtime'
            ? 'vendor/[name]-[hash].js'
            : '[name]-[hash].js';
        },
        codeSplitting: {
          groups: [
            {
              name: 'vendor/bundle',
              test: /[\\/]node_modules[\\/]/,
              entriesAware: true,
            },
          ],
        },
      },
    },
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
    client: {
      build: { license: { fileName: 'vendor/LICENSE.md' } },
    },
  },

  define,

  publicDir: 'resources',
  resolve: { tsconfigPaths: true },
} satisfies UserConfig;
