import path from 'node:path';
import { Readable } from 'node:stream';
import consumers from 'node:stream/consumers';
import { pathToFileURL } from 'node:url';

import type { Plugin } from 'vite';
import { isRunnableDevEnvironment } from 'vite';

import { getChunk } from './_util.ts';

export const prerenderOutDir = 'node_modules/.tmp/prerender';

export interface Options {
  /**
   * Build-time entry. Receives `{ output, runtimeChunk }` and must return a [Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) of HTML.
   *
   * Example:
   *   - `./popup/popup.prerender.tsx`
   */
  input: string;

  /**
   * Output HTML filename.
   *
   * Example:
   *   - `popup/popup.html`
   */
  output: string;

  /**
   * Browser-side hydration entry, e.g. with React.hydrateRoot().
   *
   * Example:
   *   - `./popup/popup.runtime.tsx`
   */
  runtime: string;
}

export default function ({ input, output, runtime }: Options): Plugin {
  return {
    name: 'prerender',

    applyToEnvironment(env) {
      return env.name === 'client';
    },

    // dev or preview
    configureServer(server) {
      const environment = server.environments.prerender;
      if (!isRunnableDevEnvironment(environment)) {
        return;
      }

      server.middlewares.use(async function (req, res, next) {
        if (req.url !== `/${output}`) {
          return next();
        }

        const { default: module } = await environment.runner.import(input);
        if (typeof module !== 'function') {
          throw new Error(
            `${input} must have a default export that is a function`,
          );
        }

        const stream = await module({
          output,
          runtimeChunk: { fileName: runtime },
        });
        res.setHeader('Content-Type', 'text/html');
        Readable.fromWeb(stream).pipe(res);
      });
    },

    // build
    async generateBundle(_outputOptions, bundle) {
      const runtimeChunk = getChunk(bundle, runtime);

      const built = path.resolve(
        prerenderOutDir,
        `${path.parse(input).name}.js`,
      );
      // Rebuild when the prerender environment emits a new entry (watch mode).
      this.addWatchFile(built);

      const { default: module } = await import(
        `${pathToFileURL(built)}?t=${Date.now()}`
      );
      if (typeof module !== 'function') {
        throw new Error(
          `${input} must have a default export that is a function`,
        );
      }

      const stream = await module({ output, runtimeChunk });
      const source = await consumers.text(stream);
      this.emitFile({ type: 'asset', fileName: output, source });
    },
  };
}
