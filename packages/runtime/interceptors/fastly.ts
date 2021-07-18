import { Request } from '../lib/request';
import * as airportService from '../services/airport/airport_service';

import { Match } from './_common';

export interface FastlyMatch extends Match {
  heuristic: 'fastly';
  extra: {
    pop: string;
    cacheStatus: string | null;
    cacheHit: string | null;
  };
}

export async function dispatch(
  request: Request
): Promise<ReadonlyArray<FastlyMatch>> {
  const bundles = getBundles(request);

  const matches = await Promise.all(
    bundles.map(([hop, cacheStatus, cacheHit], idx) => {
      const pop = lookupAirport(hop);
      if (!pop) {
        return null;
      }

      const result: FastlyMatch = {
        heuristic: 'fastly',

        score: getScore(request, 100 - (100 / bundles.length) * idx),
        isoCountry: pop.airport.iso_country,
        isoRegion: pop.airport.iso_region,
        continent: pop.airport.continent || null,

        extra: {
          pop: pop.code,
          cacheStatus,
          cacheHit,
        },
      };

      return result;
    })
  );

  return matches.filter(Boolean) as FastlyMatch[];
}

function getBundles(request: Request) {
  const servedByHops = request.getHeader('x-served-by').split(',');
  const cacheStatuses = request.getHeader('x-cache').split(',');
  const cacheHits = request.getHeader('x-cache-hits').split(',');

  return servedByHops.map((hop, i) => {
    const result: [string, string | null, string | null] = [
      hop.trim().toLocaleUpperCase(),
      null,
      null,
    ];

    if (servedByHops.length === cacheStatuses.length) {
      result[1] = cacheStatuses[i].trim() || null;
    }

    if (servedByHops.length === cacheHits.length) {
      result[2] = cacheHits[i].trim() || null;
    }

    return result;
  });
}

function lookupAirport(hop: string) {
  const code = getPop(hop);
  if (!code) {
    return null;
  }

  const airport = airportService.lookup(code);
  if (!airport) {
    return null;
  }

  return {
    code,
    airport,
  };
}

function getPop(hop: string) {
  const components = hop.split('-');

  if (components.length !== 3) {
    return null;
  }

  if (components[0] !== 'CACHE') {
    return null;
  }

  if (!components[1].startsWith(components[2])) {
    return null;
  }

  return components[2];
}

function getScore(request: Request, coefficient: number) {
  const hasFastlyReqId = request.getHeader('x-fastly-request-id') !== '';

  return (0.2 / 100) * coefficient + (hasFastlyReqId ? 0.7 : 0.6);
}
