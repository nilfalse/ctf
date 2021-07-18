import { Storage } from 'webextension-polyfill-ts';

import * as debug from '../../util/debug';

type Preferences = Record<string, string>;

type DefaultPreferences = typeof defaults;
type PreferenceKeys = keyof DefaultPreferences;

export type RenderPreference = 'emoji' | 'twemoji';

const defaults = {
  render: 'twemoji' as RenderPreference,
};

const _prefs = Object.assign(
  Object.create(null),
  defaults
) as Readonly<DefaultPreferences>;

export function getValue<T extends PreferenceKeys>(
  prefName: T
): typeof _prefs[T];
export function getValue(prefName: string): string;
export function getValue(prefName: string) {
  assertKnownPreference(prefName);

  return _prefs[prefName];
}

function assertKnownPreference(
  prefName: string
): asserts prefName is keyof typeof _prefs {
  debug.assert(
    prefName in _prefs,
    `Cannot retrieve unexpected "${prefName}" preference`
  );
}

export async function set(prefs: Preferences) {
  for (const key of Object.keys(prefs)) {
    if (!(key in _prefs)) {
      throw new Error(`Cannot set an unexpected "${key}" preference`);
    }
  }

  await browser.storage.sync.set(prefs);
  return Object.assign(_prefs, prefs);
}

export function refresh(
  changes: Record<string, Storage.StorageChange>,
  namespace: 'sync' | 'local' | 'managed'
): void;
export function refresh(
  changes: Record<string, Storage.StorageChange>,
  namespace: string
): void;
export function refresh(
  changes: Record<string, Storage.StorageChange>,
  namespace: string
): void {
  if (namespace !== 'sync') {
    return;
  }

  Object.assign(
    _prefs,
    Object.fromEntries(
      Object.entries(changes).map(([key, { newValue }]) => {
        return [key, newValue];
      })
    )
  );
}

export async function init() {
  const { os } = await browser.runtime.getPlatformInfo();
  const synced = await browser.storage.sync.get(Object.keys(_prefs));

  const conditionals: Partial<DefaultPreferences> = {};
  if (os === 'mac') {
    conditionals.render = 'emoji';
  }

  Object.assign(_prefs, defaults, conditionals, synced);
}
