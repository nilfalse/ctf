import { lookupUpperCase } from '../common';
import * as airports from '../lib/airports';
import { CountryRequest } from '../lib/country_request';

import { Match } from './_common';

type Ray = Readonly<[string, string]>;
enum CacheStatus {
  'HIT' = 'HIT',
  'MISS' = 'MISS',
  'BYPASS' = 'BYPASS',
  'EXPIRED' = 'EXPIRED',
  'DYNAMIC' = 'DYNAMIC',
}

function getRay(request: CountryRequest) {
  const header = request.getHeader('cf-ray');

  const ray: ReadonlyArray<string> = header.split('-');

  return ray.length === 2 ? (ray as Ray) : null;
}

function isCacheStatus(token: string): token is CacheStatus {
  return Object.values(CacheStatus).includes(token as CacheStatus);
}

function getScore(request: CountryRequest) {
  const score =
    request.getHeader('server').toLowerCase() === 'cloudflare' ? 1.0 : 0.75;

  return score;
}

export interface CloudflareMatch extends Match {
  heuristic: 'cloudflare';
  extra: {
    ray: Ray[1];
    cacheStatus: CacheStatus | null;
  };
}

export async function dispatch(
  request: CountryRequest
): Promise<ReadonlyArray<CloudflareMatch>> {
  const ray = getRay(request);
  if (!ray) {
    return [];
  }

  const [, iataCode] = ray;
  const airport = lookupUpperCase(await airports.load(), iataCode);
  if (!airport) {
    return [];
  }

  const cacheStatus = request.getHeader('cf-cache-status');

  const result: CloudflareMatch = {
    heuristic: 'cloudflare',

    score: getScore(request),
    isoCountry: airport.iso_country,
    isoRegion: airport.iso_region,
    continent: airport.continent || null,

    extra: {
      ray: ray[1],
      cacheStatus: isCacheStatus(cacheStatus) ? cacheStatus : null,
    },
  };

  return [result];
}
