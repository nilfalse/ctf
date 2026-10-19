type KeysQuery<T> = string | string[] | Record<string, T>;

export function findByIds<T = unknown>(keys: KeysQuery<T>) {
  return browser.storage.local.get(keys) as Promise<Record<string, T>>;
}

export function upsert<T = unknown>(items: Record<string, T>) {
  return browser.storage.local.set(items);
}
