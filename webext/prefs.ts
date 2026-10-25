export function preferred<T = unknown>(keys: string[]) {
  return browser.storage.sync.get(keys) as Promise<Record<string, T>>;
}

export function heed<T = unknown>(name: string, listener: (v?: T) => unknown) {
  type Listener<T = unknown> = (changes: Changes<T>) => unknown;
  type Changes<T> = Record<string, { oldValue?: T; newValue?: T }>;

  function handleChanged(changes: Changes<T>) {
    if (!changes[name]) {
      return;
    }

    return listener(changes[name].newValue);
  }

  browser.storage.sync.onChanged.addListener(handleChanged as Listener);
}
