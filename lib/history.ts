import type { Itinerary } from '~/lib/itinerary/interfaces.ts';
import { LRU } from '~/lib/lru.ts';
import * as mem from '~/webext/mem.ts';

type Snapshot = [string, Itinerary][];

const MAX = 10;

export async function remember(k: string, origin: string, i: Itinerary) {
  const lru = LRU.of(MAX, await mem.read<Snapshot>(k));

  lru.set(origin, i);

  await mem.write(k, lru.items());
}

export async function retain(k: string, origin: string) {
  const lru = LRU.of(MAX, await mem.read<Snapshot>(k));

  const itinerary = lru.get(origin);
  if (itinerary) {
    await mem.write(k, lru.items());
  }

  return itinerary;
}

export function forget(k: string) {
  return mem.erase(k);
}
