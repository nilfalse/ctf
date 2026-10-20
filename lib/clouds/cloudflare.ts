import type { Headers, Hop } from './index.ts';

export async function infer(headers: Headers) {
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
