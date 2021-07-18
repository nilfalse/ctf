import { Request } from '../lib/request';
import * as airportService from '../services/airport/airport_service';

import { Match } from './_common';

export interface CloudFrontMatch extends Match {
  heuristic: 'cloudfront';
  extra: {
    pop: string;
    cacheStatus: string | null;
  };
}

// eslint-disable-next-line @typescript-eslint/require-await
export async function dispatch(
  request: Request
): Promise<ReadonlyArray<CloudFrontMatch>> {
  const pop = lookupPop(request);
  if (!pop) {
    return [];
  }

  const result: CloudFrontMatch = {
    heuristic: 'cloudfront',

    score: getScore(request),
    isoCountry: pop.airport.iso_country,
    isoRegion: pop.airport.iso_region,
    continent: pop.airport.continent || null,

    extra: {
      pop: pop.code,
      cacheStatus: request.getHeader('x-cache') || null,
    },
  };

  return [result];
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

function getPop(
  request: Request
): null | Readonly<[string, string | undefined]> {
  const header = request.getHeader('x-amz-cf-pop');

  const pop = header.split('-');

  return pop.length > 2 ? null : (pop as [string, string | undefined]);
}

function getScore(request: Request) {
  const isViaCloudFront = request
    .getHeader('via')
    .toLowerCase()
    .includes('.cloudfront.net (cloudfront)');

  return isViaCloudFront ? 1.0 : 0.75;
}
