import type * as clouds from '../clouds/interfaces.ts';

export interface Itinerary {
  hostname: string;
  ip: string;
  hops: clouds.Hop[];
  server: string | null;
  powered: string | null;
}
