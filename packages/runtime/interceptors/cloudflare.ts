import { Request } from '../lib/request';
import * as airportService from '../services/airport/airport_service';

import { Match } from './_common';

type Ray = Readonly<[string, string]>;

function getRay(request: Request) {
  const header = request.getHeader('cf-ray');

  const ray: ReadonlyArray<string> = header.split('-');

  return ray.length === 2 ? (ray as Ray) : null;
}

function getScore(request: Request) {
  const score =
    request.getHeader('server').toLowerCase() === 'cloudflare' ? 1.0 : 0.75;

  return score;
}

export interface CloudflareMatch extends Match {
  heuristic: 'cloudflare';
  extra: {
    ray: Ray[1];
    cacheStatus: string | null;
  };
}

// eslint-disable-next-line @typescript-eslint/require-await
export async function dispatch(
  request: Request
): Promise<ReadonlyArray<CloudflareMatch>> {
  const ray = getRay(request);
  if (!ray) {
    return [];
  }

  const [, iataCode] = ray;
  const airport = airportService.lookup(iataCode);
  if (!airport) {
    return [];
  }

  const result: CloudflareMatch = {
    heuristic: 'cloudflare',

    score: getScore(request),
    isoCountry: airport.iso_country,
    isoRegion: airport.iso_region,
    continent: airport.continent || null,

    extra: {
      ray: iataCode,
      cacheStatus: request.getHeader('cf-cache-status') || null,
    },
  };

  return [result];
}
