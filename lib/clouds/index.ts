import * as airports from '~/lib/airports.ts';
import type * as http from '~/lib/http.ts';

import * as aws from './aws.ts';
import * as cloudflare from './cloudflare.ts';
import * as fastly from './fastly.ts';

export async function infer(headers: http.Headers) {
  // Hops run from the visitor inward. Nothing in the headers tells the order of
  // two different clouds, so the one that usually fronts the other goes first.
  const hops = [
    ...cloudflare.infer(headers),
    ...aws.infer(headers),
    ...fastly.infer(headers),
  ];

  const countries = await airports.locate(hops.map((h) => h.pop));
  for (const hop of hops) {
    hop.country = countries[hop.pop] ?? 'ZZ';
  }

  return hops;
}
