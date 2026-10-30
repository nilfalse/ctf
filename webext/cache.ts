import { BASE_URL, CURRENT_CACHE } from '../const.ts' with { type: 'macro' };

export async function cached(input: string) {
  const cache = await caches.open(CURRENT_CACHE);
  return cache.match(new URL(input, BASE_URL));
}

export async function cache(response: Response) {
  const cache = await caches.open(CURRENT_CACHE);
  await cache.put(response.url, response.clone());
}

export async function clearCaches(except: Set<string>) {
  const keys = await caches.keys();

  for (const name of new Set(keys).difference(except)) {
    await caches.delete(name);
  }
}
