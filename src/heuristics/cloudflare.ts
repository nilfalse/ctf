import { findByIATA } from '../lib/airports';
import { Heuristic } from './_util';

type Ray = [string, string];

function findRay(headers?: chrome.webRequest.HttpHeader[]) {
  if (!headers) {
    return null;
  }

  const header = headers.find(({ name }) => name.toLowerCase() === 'cf-ray');
  if (!header || !header.value) {
    return null;
  }

  const ray: ReadonlyArray<string> = header.value.split('-');
  if (ray.length !== 2) {
    return null;
  }

  return ray as Ray;
}

export async function parse(
  res: chrome.webRequest.WebResponseCacheDetails
): Promise<ReadonlyArray<Heuristic>> {
  const ray = findRay(res.responseHeaders);
  if (!ray) {
    return [];
  }

  const [, iataCode] = ray;
  const airport = await findByIATA(iataCode);
  if (!airport) {
    return [];
  }

  return [
    {
      heuristic: 'cloudflare',

      weight: 1.0, // FIXME: check Server header to match 'cloudflare'
      isoCountry: airport.iso_country,
      isoRegion: airport.iso_region,
      continent: airport.continent,
    },
  ];
}
