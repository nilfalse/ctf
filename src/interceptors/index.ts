import { CountryRequest } from '../lib/country_request';

import { heuristics, Match } from './heuristics';

export * from './heuristics';

export async function run(request: CountryRequest) {
  const matches = await Promise.all<ReadonlyArray<Match>>(
    heuristics.map((interceptor) => interceptor.dispatch(request))
  );

  return matches
    .flatMap((match) => match)
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);
}
