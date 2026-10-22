import * as airports from '~/lib/airports.ts';
import type * as http from '~/lib/http.ts';

import * as cloudflare from './cloudflare.ts';

export async function infer(headers: http.Headers) {
  const hops = await cloudflare.infer(headers);

  const countries = await airports.locate(hops.map((h) => h.pop));
  for (const hop of hops) {
    hop.country = countries[hop.pop] ?? 'ZZ';
  }

  return hops;
}
