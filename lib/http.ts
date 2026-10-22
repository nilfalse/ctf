import type * as network from '~/webext/net.ts';

export interface Headers extends ReadonlyMap<string, readonly string[]> {}

export function toHeaderMap(headers?: network.Header[]): Headers {
  const map = new Map<string, string[]>();

  if (headers) {
    for (const { name, value } of headers) {
      if (value === undefined) {
        continue;
      }

      const key = name.toLowerCase();
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)!.push(value);
    }
  }

  return map;
}
