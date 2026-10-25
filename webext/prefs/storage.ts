export /* @inline */ function get(): Promise<Record<string, unknown>> {
  return browser.storage.sync.get();
}

export /* @inline */ function set(items: Record<string, unknown>) {
  return browser.storage.sync.set(items);
}

export /* @inline */ function remove(keys: string[]) {
  return browser.storage.sync.remove(keys);
}

type Changes = Record<string, { oldValue?: unknown; newValue?: unknown }>;

export /* @inline */ function onChanged(
  listener: (changes: Changes) => unknown,
) {
  return browser.storage.sync.onChanged.addListener(listener);
}
