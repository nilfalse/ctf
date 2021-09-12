import * as cloudflare from './cloudflare';
import * as cloudfront from './cloudfront';
import * as fastly from './fastly';
import * as ip from './ip';

export type Match =
  | cloudflare.CloudflareMatch
  | cloudfront.CloudFrontMatch
  | fastly.FastlyMatch
  | ip.IPMatch;

export const heuristics = [ip, cloudflare, cloudfront, fastly];
