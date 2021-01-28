import * as debug from '../../util/debug';
import { getPlatform } from '../environment/environment_service';

type Preferences = Record<string, string>;

type DefaultPreferences = typeof defaults;
type PreferenceKeys = keyof DefaultPreferences;

export type RenderPreference = 'emoji' | 'twemoji';

const defaults = {
  render: 'twemoji' as RenderPreference,
};

const _prefs: Readonly<DefaultPreferences> = Object.assign(
  Object.create(null),
  defaults
);

export function getValue<T extends PreferenceKeys>(
  prefName: T
): typeof _prefs[T];
export function getValue(prefName: string): string;
export function getValue(prefName: string) {
  debug.assert(
    prefName in _prefs,
    `Cannot retrieve unexpected "${prefName}" preference`
  );

  return _prefs[prefName];
}

export function set(prefs: Preferences) {
  for (const key of Object.keys(prefs)) {
    if (!(key in _prefs)) {
      return Promise.reject(
        new Error(`Cannot set an unexpected "${key}" preference`)
      );
    }
  }

  return new Promise<Preferences>((resolve, reject) => {
    chrome.storage.sync.set(prefs, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(Object.assign(_prefs, prefs));
      }
    });
  });
}

export function refresh(
  changes: Record<string, chrome.storage.StorageChange>,
  namespace: 'sync' | 'local' | 'managed'
) {
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

export function init() {
  return getPlatform().then(_init);
}

function _init({ os }: chrome.runtime.PlatformInfo) {
  return new Promise<void>((resolve) => {
    chrome.storage.sync.get(Object.keys(_prefs), (synced) => {
      const conditionals: Partial<DefaultPreferences> = {};
      if (os === 'mac') {
        conditionals.render = 'emoji';
      }

      Object.assign(_prefs, defaults, conditionals, synced);

      resolve();
    });
  });
}
