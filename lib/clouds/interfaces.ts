export interface Hop {
  cloud: 'cloudflare' | 'aws' | 'fastly';
  pop: ThreeUppercaseLetters;
  country: TwoUppercaseLetters;
  cacheStatus: string | null;
}
