import type { Hop } from '~/lib/clouds/interfaces.ts';
import type * as http from '~/lib/http.ts';

// CPH50-P2: an airport, a site number and a cache tier.
const POP = /^([A-Z]{3})\d*(?:-\w+)?$/;
// Origins and other CDNs write to x-cache as well.
const STATUS = /\w+ from cloudfront/i;

export function infer(headers: http.Headers) {
  const values = headers.get('x-amz-cf-pop') || [];
  const statuses = headers.get('x-cache') || [];

  return values.flatMap(function (value, idx) {
    const pop = value.match(POP)?.[1];
    if (!pop) {
      return [];
    }

    return {
      cloud: 'aws',
      pop,
      cacheStatus: statuses[idx]?.match(STATUS)?.[0] ?? null,
    } as Hop;
  });
}
