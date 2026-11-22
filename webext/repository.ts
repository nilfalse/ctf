export function findByIds<T = unknown>(keys?: string[]) {
  return browser.storage.local.get(keys) as Promise<Record<string, T>>;
}

export function upsert<T = unknown>(items: Record<string, T>) {
  return browser.storage.local.set(items);
}

export function remove(keys: string[]) {
  return browser.storage.local.remove(keys);
}
