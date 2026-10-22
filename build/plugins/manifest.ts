import assert from 'node:assert/strict';

import type { Plugin } from 'vite';
import type Moz from 'webextension-polyfill';

import pkg from '../../package.json' with { type: 'json' };
import { getChunk } from './_util.ts';

interface Options {
  backgroundScript?: string;
  backgroundWorker?: string;
  popup: string;
}

export default function (opts: Options): Plugin {
  return {
    name: 'manifest',

    applyToEnvironment(environment) {
      return environment.name === 'client';
    },

    generateBundle(_options, bundle) {
      const backgroundScript =
        opts.backgroundScript &&
        getChunk(bundle, opts.backgroundScript).fileName;
      const backgroundWorker =
        opts.backgroundWorker &&
        getChunk(bundle, opts.backgroundWorker).fileName;
      const popup = bundle[opts.popup];
      assert(popup, `Cannot find "${opts.popup}" in the final bundle`);

      const { GITHUB_SHA, FEATURE_PAGE_ACTION, FEATURE_DNS } = process.env;

      const permissions: Moz.Manifest.Permission[] = ['webRequest', 'storage'];
      if (FEATURE_DNS === '1') {
        permissions.push('dns');
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
          FEATURE_PAGE_ACTION === '0'
            ? undefined
            : {
                default_icon: 'icons/page_action.svg',
                default_popup: popup.fileName,
                show_matches: ['<all_urls>'],
              },
        action:
          FEATURE_PAGE_ACTION === '1'
            ? undefined
            : {
                default_icon: icons,
                default_popup: popup.fileName,
              },

        background: {
          type: 'module',
          service_worker: backgroundWorker,
          scripts: backgroundScript ? [backgroundScript] : undefined,
          preferred_environment: ['service_worker'],
        },

        permissions,
        host_permissions: ['*://*/*'],

        author: pkg.author,
        browser_specific_settings: {
          gecko: { id: '@ctf' },
        },
      };

      const source = JSON.stringify(manifest, null, 2);
      this.emitFile({ type: 'asset', fileName: 'manifest.json', source });
    },
  };
}
