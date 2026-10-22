import { describe, expect, it } from 'vitest';

import { fromSearchParams, toSearchParams } from './codec.ts';

describe('toSearchParams', () => {
  it('should encode', () =>
    expect(
      toSearchParams({
        hostname: 'example.com',
        ip: '192.0.2.1',
        server: 'cloudflare',
        powered: 'WP Engine Headless Platform',
        hops: [
          {
            cloud: 'cloudflare',
            pop: 'KBP',
            country: 'UA',
            cacheStatus: 'HIT',
          },
          {
            cloud: 'cloudflare',
            pop: 'CPH',
            country: 'DK',
            cacheStatus: null,
          },
        ],
      }).toString(),
    ).toBe(
      'h=example.com&ip=192.0.2.1&s=cloudflare&p=WP+Engine+Headless+Platform&hop=cf.KBP.UA.HIT&hop=cf.CPH.DK',
    ));

  it('should omit parameters for missing server and powered-by', () =>
    expect(
      toSearchParams({
        hostname: 'example.com',
        ip: '192.0.2.1',
        hops: [],
        server: null,
        powered: null,
      }).toString(),
    ).toBe('h=example.com&ip=192.0.2.1'));
});

describe('fromSearchParams', () => {
  it('should decode', () =>
    expect(
      fromSearchParams(
        '?h=example.com&ip=192.0.2.1&s=cloudflare&p=WP+Engine+Headless+Platform&hop=cf.KBP.UA.HIT&hop=cf.CPH.DK',
      ),
    ).toStrictEqual({
      hostname: 'example.com',
      ip: '192.0.2.1',
      server: 'cloudflare',
      powered: 'WP Engine Headless Platform',
      hops: [
        { cloud: 'cloudflare', pop: 'KBP', country: 'UA', cacheStatus: 'HIT' },
        { cloud: 'cloudflare', pop: 'CPH', country: 'DK', cacheStatus: null },
      ],
    }));

  it('should return null for empty string', () =>
    expect(fromSearchParams('')).toBeNull());

  it('should reject a hop from an unknown cloud', () =>
    expect(() => fromSearchParams('h=example.com&hop=xx.KBP.UA')).toThrow(
      'Unexpected hop: xx.KBP.UA',
    ));
});
