import * as cloudflare from './cloudflare';
import * as ip from './ip';

const heuristics = [ip, cloudflare];

export async function guess(res: chrome.webRequest.WebResponseCacheDetails) {
  const results = await Promise.all(
    heuristics.map((heuristic) => heuristic.parse(res))
  );

  const rankedGuesses = results
    .flatMap((match) => match)
    .filter(({ weight }) => weight > 0)
    .sort((a, b) => b.weight - a.weight);

  return rankedGuesses;
}
