import { CountryRequest } from '../country_request';
import { lookup } from '../lib/geoip';
import { Match } from './_base';

export interface IPMatch extends Match {
  heuristic: 'ip' | 'ip_registered';
  extra: null;
}

export async function resolve({
  ip,
}: CountryRequest): Promise<ReadonlyArray<IPMatch>> {
  if (!ip) {
    return [];
  }

  const countryResponse = await lookup(ip);
  if (!countryResponse) {
    return [];
  }

  const result = [];
  const { country, registered_country } = countryResponse;
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
  if (registered_country) {
    result.push({
      heuristic: 'ip_registered' as const,

      score: 0.1,
      isoCountry: registered_country.iso_code,
      isoRegion: null,
      continent: null,
      extra: null,
    });
  }

  return result;
}
