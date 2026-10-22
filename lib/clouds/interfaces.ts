export interface Hop {
  cloud: 'cloudflare';
  pop: string;
  country: TwoUppercaseLetters;
  cacheStatus: string | null;
}
