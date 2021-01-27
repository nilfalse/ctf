import { stub } from './stub';

type Preferences = Record<string, string>;

export function storage(prefs: Preferences = {}) {
  const browser = stub();

  const _prefs = JSON.parse(JSON.stringify(prefs));
  const get = (
    keys: string[] | null,
    callback: (items: Preferences) => void
  ) => {
    if (keys === null) {
      setImmediate(() => callback(_prefs));
    } else if (Array.isArray(keys)) {
      setImmediate(() =>
        callback(
          Object.fromEntries(
            keys
              .filter((key) => _prefs[key] !== undefined)
              .map((key) => [key, _prefs[key]])
          )
        )
      );
    }
  };
  const set = (items: Preferences, callback: () => void) =>
    setImmediate(() => {
      Object.assign(prefs, items);
      callback();
    });

  beforeEach(() => {
    function createArea(): Partial<chrome.storage.StorageArea> {
      return {
        get: jest.fn().mockImplementation(get),
        set: jest.fn().mockImplementation(set),
      };
    }

    const onChanged: Pick<chrome.storage.StorageChangedEvent, 'addListener'> = {
      addListener: jest.fn(),
    };

    browser.storage = {
      local: createArea() as chrome.storage.LocalStorageArea,
      sync: createArea() as chrome.storage.SyncStorageArea,
      managed: createArea() as chrome.storage.StorageArea,
      onChanged: onChanged as chrome.storage.StorageChangedEvent,
    };
  });

  afterEach(() => {
    delete browser.storage;
  });
}
