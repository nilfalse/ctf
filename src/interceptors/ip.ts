import { CountryRequest } from '../lib/country_request';
import * as maxmind from '../lib/geo';

import { Match } from './_common';

export interface IPMatch extends Match {
  heuristic: 'ip';
  extra: { registeredCountry: string } | null;
}

export async function dispatch({
  ip,
}: CountryRequest): Promise<ReadonlyArray<IPMatch>> {
  if (!ip) {
    return [];
  }

  const geoip = await maxmind.load();
  const countryResponse = geoip.get(ip);
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
