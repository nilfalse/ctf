import * as airports from '~/lib/airports.ts';
import type * as network from '~/webext/net.ts';

import * as cloudflare from './cloudflare.ts';

export interface Hop {
  cloud: 'cloudflare';
  pop: string;
  country: string;
  cacheStatus: string | null;
}

export interface Headers extends ReadonlyMap<string, readonly string[]> {}

export async function infer(headers: network.Header[] | undefined) {
  if (!headers) {
    return [];
  }

  const map = toHeadersMap(headers);

  const hops = await cloudflare.infer(map);

  const countries = await airports.locate(hops.map((h) => h.pop));
  for (const hop of hops) {
    hop.country = countries[hop.pop] ?? 'ZZ';
  }

  return hops;
}

function toHeadersMap(headers: network.Header[]): Headers {
  const map = new Map<string, string[]>();

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

  return map;
}
