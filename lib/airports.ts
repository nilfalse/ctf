import fetch from '~/webext/fetch/index.ts';
import * as repository from '~/webext/repository.ts';

export function locate(codes: string[]) {
  return repository.findByIds<TwoUppercaseLetters>(codes);
}

export async function populate() {
  interface Airport {
    country: TwoUppercaseLetters;
    region: string;
  }

  const dataset = await fetch<Record<ThreeUppercaseLetters, Airport>>(
    'datasets/airports.json',
  );

  const map = Object.fromEntries(
    Object.entries(dataset).map(([k, v]) => [k, v.country]),
  ) as Record<ThreeUppercaseLetters, TwoUppercaseLetters>;

  await repository.upsert(map);
}
