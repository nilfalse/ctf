import { Request } from '../lib/request';
import { db } from '../services/geo/geo_service';

import { Match } from './_common';

export interface IPMatch extends Match {
  heuristic: 'ip';
  extra: { registeredCountry: string } | null;
}

// eslint-disable-next-line @typescript-eslint/require-await
export async function dispatch({
  ip,
}: Request): Promise<ReadonlyArray<IPMatch>> {
  if (!ip) {
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const countryResponse = db!.get(ip);
  if (!countryResponse) {
    return [];
  }

  const result = [];
  const { country, registered_country: registeredCountry } = countryResponse;
  if (country) {
    const continent = countryResponse.continent
      ? countryResponse.continent.code
      : null;

    const extra = registeredCountry
      ? {
          registeredCountry: registeredCountry.iso_code,
        }
      : null;

    result.push({
      heuristic: 'ip' as const,

      score: 0.5,
      isoCountry: country.iso_code,
      isoRegion: null,
      continent,
      extra,
    });
  }

  return result;
}
