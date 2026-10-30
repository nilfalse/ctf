import fetch from '~/webext/fetch.ts';
import * as repository from '~/webext/repository.ts';

type Prefix = 'iata_';

export async function locate(codes: string[]) {
  const iatas = await repository.findByIds<TwoUppercaseLetters>(
    codes.map((c) => ('iata_' satisfies Prefix) + c),
  );

  const airports: Record<string, TwoUppercaseLetters> = {};
  for (const [k, v] of Object.entries(iatas)) {
    airports[k.substring(('iata_' satisfies Prefix).length)] = v;
  }

  return airports;
}

export async function loadAirports() {
  interface Airport {
    country: TwoUppercaseLetters;
    region: string;
  }

  const dataset = await fetch<Record<string, Airport>>(
    'datasets/airports.json',
  );

  const map: Record<string, TwoUppercaseLetters> = {};
  for (const [k, v] of Object.entries(await dataset.json())) {
    map[('iata_' satisfies Prefix) + k] = v.country;
  }

  await repository.upsert(map);
}
