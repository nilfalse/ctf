type Preferences = Record<string, string>;

const defaults = {
  render: 'emoji' as 'emoji' | 'twemoji',
} as const;

const _prefs: typeof defaults = Object.assign(Object.create(null), defaults);

export function getValue<T extends keyof typeof _prefs>(
  prefName: T
): typeof _prefs[T];
export function getValue(prefName: string): string;
export function getValue(prefName: string) {
  if (prefName in _prefs) {
    return _prefs[prefName];
  } else {
    throw new Error(`Cannot retrieve unexpected "${prefName}" preference`);
  }
}

export function set(prefs: Preferences) {
  for (const key of Object.keys(prefs)) {
    if (!(key in _prefs)) {
      return Promise.reject(
        new Error(`Cannot set an unexpected "${key}" preference`)
      );
    }
  }

  return new Promise<void>((resolve, reject) => {
    chrome.storage.sync.set(prefs, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve();
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
  return new Promise<void>((resolve) => {
    chrome.storage.sync.get(Object.keys(_prefs), (result) => {
      Object.assign(_prefs, defaults, result);

      resolve();
    });
  });
}
