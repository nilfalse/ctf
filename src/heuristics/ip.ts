import { CountryRequest } from '../lib/country_request';
import * as maxmind from '../lib/geo';

import { Match } from './_common';

export interface IPMatch extends Match {
  heuristic: 'ip' | 'ip_registered';
  extra: null;
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

    result.push({
      heuristic: 'ip' as const,

      score: 0.5,
      isoCountry: country.iso_code,
      isoRegion: null,
      continent,
      extra: null,
    });
  }
  if (registeredCountry) {
    result.push({
      heuristic: 'ip_registered' as const,

      score: 0.1,
      isoCountry: registeredCountry.iso_code,
      isoRegion: null,
      continent: null,
      extra: null,
    });
  }

  return result;
}
