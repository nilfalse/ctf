import * as cloudflare from './cloudflare';
import * as cloudfront from './cloudfront';
import * as ip from './ip';

export type Match =
  | cloudflare.CloudflareMatch
  | cloudfront.CloudFrontMatch
  | ip.IPMatch;

export const heuristics = [ip, cloudflare, cloudfront];
