import type { Hop } from '~/lib/clouds/interfaces.ts';
import type { Itinerary } from '~/lib/itinerary/interfaces.ts';

const CLOUD_TO_PARAM = {
  aws: 'aws',
  cloudflare: 'cf',
  fastly: 'f',
} as const satisfies Record<Hop['cloud'], string>;

// A shared param would invert to a union, and PARAM_TO_CLOUD could then drop a cloud
export type _UniqueParams = AssertNever<Collisions<typeof CLOUD_TO_PARAM>>;

export function toSearchParams(i: Itinerary) {
  const search = new URLSearchParams({ h: i.hostname, ip: i.ip });

  if (i.country != null) {
    search.append('c', i.country);
  }
  if (i.registered != null) {
    search.append('r', i.registered);
  }
  if (i.server != null) {
    search.append('s', i.server);
  }
  if (i.powered != null) {
    search.append('p', i.powered);
  }

  for (const { cloud, pop, country, cacheStatus } of i.hops) {
    const v = `${CLOUD_TO_PARAM[cloud]}.${pop}.${country}`;
    search.append('hop', cacheStatus ? `${v}.${cacheStatus}` : v);
  }

  return search;
}

const PARAM_TO_CLOUD: Invert<typeof CLOUD_TO_PARAM> = {
  aws: 'aws',
  cf: 'cloudflare',
  f: 'fastly',
};

export function fromSearchParams(s: string): Itinerary | null {
  if (!s) {
    return null;
  }

  const params = new URLSearchParams(s);

  const hops = params.getAll('hop').map(function (value) {
    const [param, pop, country, ...cache] = value.split('.');
    if (!Object.hasOwn(PARAM_TO_CLOUD, param)) {
      throw new Error('Unexpected hop: ' + value);
    }

    return {
      cloud: PARAM_TO_CLOUD[param as keyof typeof PARAM_TO_CLOUD],
      pop,
      country,
      cacheStatus: cache.length ? cache.join('.') : null,
    } as Hop;
  });

  return {
    hostname: params.get('h')!,
    ip: params.get('ip')!,
    country: params.get('c') as TwoUppercaseLetters,
    registered: params.get('r') as TwoUppercaseLetters,
    hops,
    server: params.get('s'),
    powered: params.get('p'),
  };
}
