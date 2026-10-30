import type * as clouds from '../clouds/interfaces.ts';

export interface Itinerary {
  hostname: string;
  ip: string;
  country: TwoUppercaseLetters | null;
  registered: TwoUppercaseLetters | null;
  hops: clouds.Hop[];
  server: string | null;
  powered: string | null;
}
