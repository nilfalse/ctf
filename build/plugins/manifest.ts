import assert from 'node:assert/strict';
import * as fs from 'node:fs/promises';

import type { Plugin } from 'vite';
import type Moz from 'webextension-polyfill';

import pkg from '../../package.json' with { type: 'json' };
import features from '../features.ts';
import { getChunk } from './_util.ts';

interface Options {
  env: Record<string, string | undefined>;
  background: string;
  popup: string;
}

// chrome148: browser.* namespace
// chrome150: offscreen.hasDocument
export const MINIMUM_CHROME_VERSION = '150';

export default function (opts: Options): Plugin {
  const feature = features(opts.env);

  return {
    name: 'manifest',

    applyToEnvironment(environment) {
      return environment.name === 'client';
    },

    async generateBundle(_options, bundle) {
      const background = getChunk(bundle, opts.background).fileName;
      const popup = bundle[opts.popup];
      assert(popup, `Cannot find "${opts.popup}" in the final bundle`);

      const { GITHUB_SHA } = process.env;

      const permissions: Moz.Manifest.Permission[] = ['webRequest', 'storage'];
      if (feature('DNS')) {
        permissions.push('dns');
      }
      if (feature('TOOLBAR_SVG') === false) {
        permissions.push('offscreen');
      }

      const icons = {
        32: 'icons/logo_32px.png',
        48: 'icons/logo_48px.png',
        128: 'icons/logo_128px.png',
        256: 'icons/logo_256px.png',
        512: 'icons/logo_512px.png',
      };

      const manifest: Moz.Manifest.WebExtensionManifest = {
        manifest_version: 3,

        name: '__MSG_EXT_NAME__',
        short_name: '__MSG_EXT_SHORT_NAME__',
        version: pkg.version,
        version_name:
          GITHUB_SHA && `${pkg.version} (${GITHUB_SHA.substring(0, 8)})`,

        default_locale: 'en',
        description: '__MSG_EXT_DESCRIPTION__',
        icons,

        // When FEATURE_PAGE_ACTION is unset both keys are emitted.
        page_action:
          feature('PAGE_ACTION') === false
            ? undefined
            : {
                default_icon: 'icons/page_action.svg',
                default_popup: popup.fileName,
                show_matches: ['<all_urls>'],
              },
        action:
          feature('PAGE_ACTION') === true
            ? undefined
            : {
                default_icon: icons,
                default_popup: popup.fileName,
              },

        // When FEATURE_SERVICE_WORKER is unset both keys are emitted.
        background: {
          type: 'module',
          service_worker:
            feature('SERVICE_WORKER') === false ? undefined : background,
          scripts:
            feature('SERVICE_WORKER') === true ? undefined : [background],
          preferred_environment:
            feature('SERVICE_WORKER') === undefined
              ? ['service_worker']
              : undefined,
        },

        permissions,
        host_permissions: ['*://*/*'],

        author: pkg.author,
        browser_specific_settings: {
          gecko: { id: '@ctf' },
        },
        minimum_chrome_version: MINIMUM_CHROME_VERSION,
      };

      const source = JSON.stringify(manifest, null, 2);
      this.emitFile({ type: 'asset', fileName: 'manifest.json', source });

      if (feature('PAGE_ACTION') !== false) {
        this.emitFile({
          type: 'asset',
          fileName: 'icons/page_action.svg',
          source: await fs.readFile('./assets/page_action.svg'),
        });
      }
    },
  };
}
