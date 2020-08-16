import * as cloudflare from './cloudflare';
import * as ip from './ip';

export type Match = cloudflare.CloudflareMatch | ip.IPMatch;

export const heuristics = [ip, cloudflare];
