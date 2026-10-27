import react from '@vitejs/plugin-react';
import compilecat from 'compilecat/vite';
import type { InputOption } from 'rolldown';
import macros from 'unplugin-macros/vite';
import { defineConfig, loadEnv } from 'vite';
import checker from 'vite-plugin-checker';
import svgr from 'vite-plugin-svgr';

import features from './build/features.ts';
import manifest from './build/plugins/manifest.ts';
import prerender from './build/plugins/prerender.ts';
import { prerenderOutDir } from './build/plugins/prerender.ts';

export default defineConfig(({ mode }) => {
  const envPrefix = 'FEATURE_';
  const env = loadEnv(mode, import.meta.dirname, envPrefix);
  const feature = features(env);

  const input: InputOption = {
    background: './background.ts',
    popup: './popup/popup.runtime.tsx',
  };
  if (feature('TOOLBAR_SVG') === false) {
    // the only way to render SVG on canvas in Chromium is DOM
    input.offscreen = './offscreen.html';
  }

  const define: Record<string, string> = {
    'typeof browser.dns': JSON.stringify(
      feature('DNS') ? 'object' : 'undefined',
    ),
  };
  feature(
    'PAGE_ACTION',
    (pageAction) =>
      (define['typeof browser.pageAction'] = JSON.stringify(
        pageAction ? 'function' : 'undefined',
      )),
  );

  return {
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
      svgr({
        svgrOptions: { plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx'] },
      }),
      react(),

      prerender({
        input: './popup/popup.prerender.tsx',
        output: 'popup.html',
        runtime: './popup/popup.runtime.tsx',
      }),

      manifest({
        env,
        background: './background.ts',
        popup: 'popup.html',
      }),
    ],

    input,
    build: {
      target: ['chrome148', 'firefox121'],
      assetsDir: '.',
      modulePreload: { polyfill: false },
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

    envPrefix,
    define,

    publicDir: 'resources',
    resolve: { tsconfigPaths: true },
  };
});
