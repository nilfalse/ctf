import { describe, expect, it } from 'vitest';

import { fromSearchParams, toSearchParams } from './codec.ts';

describe('toSearchParams', () => {
  it('should encode multiple hops', () =>
    expect(
      toSearchParams({
        hostname: 'example.com',
        ip: '192.0.2.1',
        country: 'DK',
        registered: 'NL',
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
      'h=example.com&ip=192.0.2.1&c=DK&r=NL&s=cloudflare&p=WP+Engine+Headless+Platform&hop=cf.KBP.UA.HIT&hop=cf.CPH.DK',
    ));

  it('should encode multiple clouds', () =>
    expect(
      toSearchParams({
        hostname: 'example.com',
        ip: '192.0.2.1',
        country: null,
        registered: null,
        server: null,
        powered: null,
        hops: [
          {
            cloud: 'cloudflare',
            pop: 'CPH',
            country: 'DK',
            cacheStatus: 'DYNAMIC',
          },
          {
            cloud: 'aws',
            pop: 'FRA',
            country: 'DE',
            cacheStatus: 'Miss from cloudfront',
          },
          {
            cloud: 'fastly',
            pop: 'RTM',
            country: 'NL',
            cacheStatus: null,
          },
        ],
      }).toString(),
    ).toBe(
      'h=example.com&ip=192.0.2.1&hop=cf.CPH.DK.DYNAMIC&hop=aws.FRA.DE.Miss+from+cloudfront&hop=f.RTM.NL',
    ));

  it('should omit optional parameters', () =>
    expect(
      toSearchParams({
        hostname: 'example.com',
        ip: '192.0.2.1',
        country: null,
        registered: null,
        hops: [],
        server: null,
        powered: null,
      }).toString(),
    ).toBe('h=example.com&ip=192.0.2.1'));
});

describe('fromSearchParams', () => {
  it('should decode multiple hops', () =>
    expect(
      fromSearchParams(
        '?h=example.com&ip=192.0.2.1&c=DK&r=NL&s=cloudflare&p=WP+Engine+Headless+Platform&hop=cf.KBP.UA.HIT&hop=cf.CPH.DK',
      ),
    ).toStrictEqual({
      hostname: 'example.com',
      ip: '192.0.2.1',
      country: 'DK',
      registered: 'NL',
      server: 'cloudflare',
      powered: 'WP Engine Headless Platform',
      hops: [
        { cloud: 'cloudflare', pop: 'KBP', country: 'UA', cacheStatus: 'HIT' },
        { cloud: 'cloudflare', pop: 'CPH', country: 'DK', cacheStatus: null },
      ],
    }));

  it('should decode multiple clouds', () =>
    expect(
      fromSearchParams(
        '?h=example.com&ip=192.0.2.1&hop=cf.CPH.DK.DYNAMIC&hop=aws.FRA.DE.Miss+from+cloudfront&hop=f.RTM.NL',
      ),
    ).toStrictEqual({
      hostname: 'example.com',
      ip: '192.0.2.1',
      country: null,
      registered: null,
      server: null,
      powered: null,
      hops: [
        {
          cloud: 'cloudflare',
          pop: 'CPH',
          country: 'DK',
          cacheStatus: 'DYNAMIC',
        },
        {
          cloud: 'aws',
          pop: 'FRA',
          country: 'DE',
          cacheStatus: 'Miss from cloudfront',
        },
        {
          cloud: 'fastly',
          pop: 'RTM',
          country: 'NL',
          cacheStatus: null,
        },
      ],
    }));

  it('should return null for empty string', () =>
    expect(fromSearchParams('')).toBeNull());

  it('should reject a hop from an unknown cloud', () =>
    expect(() =>
      fromSearchParams('h=example.com&hop=constructor.KBP.UA'),
    ).toThrow('Unexpected hop: constructor.KBP.UA'));
});
