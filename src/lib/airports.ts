import { isKeyof } from './_util';

interface Airport {
  continent?: string;
  iso_country: string;
  iso_region: string;
}

type AirportDatabase = { [key: string]: Airport };

export function createIndex(): Promise<AirportDatabase> {
  return fetch('data/airports.json').then((r) => r.json());
}

export let lazy = function () {
  const dataPromise = createIndex();

  lazy = () => dataPromise;
  return dataPromise;
};

export async function findByIATA(iataCode: string) {
  const indexedAirports = await lazy();

  iataCode = iataCode.toUpperCase();
  if (isKeyof(indexedAirports, iataCode)) {
    return indexedAirports[iataCode];
  }

  return null;
}
