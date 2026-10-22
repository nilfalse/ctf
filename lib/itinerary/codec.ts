import type { Hop } from '~/lib/clouds/interfaces.ts';
import type { Itinerary } from '~/lib/itinerary/interfaces.ts';

export function toSearchParams(i: Itinerary) {
  const search = new URLSearchParams({ h: i.hostname, ip: i.ip });

  if (i.server != null) {
    search.append('s', i.server);
  }
  if (i.powered != null) {
    search.append('p', i.powered);
  }

  for (const { pop, country, cacheStatus } of i.hops) {
    const v = `cf.${pop}.${country}`;
    search.append('hop', cacheStatus ? `${v}.${cacheStatus}` : v);
  }

  return search;
}

export function fromSearchParams(s: string): Itinerary | null {
  if (!s) {
    return null;
  }

  const params = new URLSearchParams(s);

  const hops = params.getAll('hop').map(function (value) {
    const [cloud, pop, country, ...cache] = value.split('.');
    switch (cloud) {
      case 'cf':
        return {
          cloud: 'cloudflare',
          pop,
          country,
          cacheStatus: cache.length ? cache.join('.') : null,
        } as Hop;

      default:
        throw new Error('Unexpected hop: ' + value);
    }
  });

  return {
    hostname: params.get('h')!,
    ip: params.get('ip')!,
    hops,
    server: params.get('s'),
    powered: params.get('p'),
  };
}
