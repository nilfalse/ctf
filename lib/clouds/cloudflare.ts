import type { Hop } from '~/lib/clouds/interfaces.ts';
import type * as http from '~/lib/http.ts';

export async function infer(headers: http.Headers) {
  const rays = headers.get('cf-ray') || [];
  const statuses = headers.get('cf-cache-status') || [];

  const pops = rays.map((r) => r.split('-')[1]);

  return pops.map(function (pop, idx) {
    return {
      cloud: 'cloudflare',
      pop,
      cacheStatus: statuses[idx] ?? null,
    } as Hop;
  });
}
