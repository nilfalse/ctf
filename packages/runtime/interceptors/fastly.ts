import { Request } from '../lib/request';
import * as airportService from '../services/airport/airport_service';

import { Match } from './_common';

export interface FastlyMatch extends Match {
  heuristic: 'fastly';
  extra: {
    pop: string;
    cacheStatus: string | null;
    cacheHits: string | null;
  };
}

export async function dispatch(
  request: Request
): Promise<ReadonlyArray<FastlyMatch>> {
  const items = parseRequest(request);
  if (!items) {
    return [];
  }

  const result: FastlyMatch = {
    heuristic: 'fastly',

    score: getScore(request),
    isoCountry: pop.airport.iso_country,
    isoRegion: pop.airport.iso_region,
    continent: pop.airport.continent || null,

    extra: {
      pop: pop.code,
      cacheStatus: request.getHeader('x-cache') || null,
      cacheHits: request.getHeader('x-cache-hits') || null,
    },
  };

  return [result];
}

function parseRequest(request: Request) {
  const servedBy = request.getHeader('x-served-by').split(',');

  if (servedBy.length === 0) {
    return null;
  }

  const result = [servedBy];

  const xCache = request.getHeader('x-cache').split(',');
  if (xCache.length === servedBy.length) {
    result.push(xCache);
  }

  const cacheHits = request.getHeader('x-cache-hits').split(',');
  if (cacheHits.length === servedBy.length) {
    result.push(cacheHits);
  }

  return result;
}

function lookupPop(request: Request) {
  const popHeaderComponents = getPop(request);
  if (!popHeaderComponents) {
    return null;
  }

  let [code] = popHeaderComponents;
  while (code.length > 1) {
    const airport = airportService.lookup(code);
    if (airport) {
      return {
        code,
        airport,
      };
    } else {
      code = code.substring(0, code.length - 1);
    }
  }

  return null;
}

function getPop(request: Request) {
  const header = request.getHeader('x-served-by').toLowerCase();

  const components = header.split('-');

  if (components.length !== 3) {
    return null;
  }

  if (components[0] !== 'cache') {
    return null;
  }

  if (!components[1].startsWith(components[2])) {
    return null;
  }

  return components[2];
}

function getScore(request: Request) {
  const hasFastlyReqId = request.getHeader('x-fastly-request-id') !== '';

  return hasFastlyReqId ? 1.0 : 0.75;
}
