import { lookup } from '../lib/geoip';
import { Heuristic } from './_util';

export async function parse(
  res: chrome.webRequest.WebResponseCacheDetails
): Promise<ReadonlyArray<Heuristic>> {
  const { ip } = res;
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
      : undefined;

    result.push({
      heuristic: 'ip',

      weight: 0.5,
      isoCountry: country.iso_code,
      isoRegion: null,
      continent,
    });
  }
  if (registered_country) {
    result.push({
      heuristic: 'ip_registered',

      weight: 0.1,
      isoCountry: registered_country.iso_code,
      isoRegion: null,
    });
  }

  return result;
}
