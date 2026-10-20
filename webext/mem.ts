export async function read<T = unknown>(k: string) {
  const map = await browser.storage.session.get(k);
  return map[k] as T | undefined;
}

export function write(k: string, v: unknown) {
  return browser.storage.session.set({ [k]: v });
}

export function erase(k: string) {
  return browser.storage.session.remove(k);
}
