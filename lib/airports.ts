import fetch from '~/webext/fetch/index.ts';
import * as repository from '~/webext/repository.ts';

const URL = 'datasets/airports.json';

export function locate(codes: string[]) {
  return repository.findByIds<TwoUppercaseLetters>(codes);
}

export async function populate() {
  interface Airport {
    country: TwoUppercaseLetters;
    region: string;
  }

  const dataset = await fetch<Record<ThreeUppercaseLetters, Airport>>(URL);

  const map = Object.fromEntries(
    Object.entries(dataset).map(([k, v]) => [k, v.country]),
  ) as Record<ThreeUppercaseLetters, TwoUppercaseLetters>;

  await repository.upsert(map);
}
