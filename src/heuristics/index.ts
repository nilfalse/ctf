import * as cloudflare from './cloudflare';
import * as ip from './ip';

export type Resolutions = ReadonlyArray<
  cloudflare.CloudflareMatch | ip.IPMatch
>;

export const heuristics = [ip, cloudflare];
