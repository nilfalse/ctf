import { parse } from 'http-z';
import { outdent } from 'outdent';
import { beforeEach, expect, test, vi } from 'vitest';

import * as airports from '~/lib/airports.ts';
import { toHeaderMap } from '~/lib/http.ts';

import * as clouds from './index.ts';
import type { Hop } from './interfaces.ts';

vi.mock('~/lib/airports.ts');

beforeEach(() => {
  vi.mocked(airports.locate).mockResolvedValue({
    CPH: 'DK',
    FRA: 'DE',
    KBP: 'UA',
    RTM: 'NL',
    SHA: 'CN',
    SJC: 'US',
  });
});

interface Fixture {
  spec: string;
  http: string;
  hops: Hop[];
}

const http = outdent({ newline: '\r\n', trimTrailingNewline: false });

const fixture: Fixture[] = [
  {
    spec: 'infer Cloudflare in front of the Fastly of GitHub Pages',
    // https://underscorejs.org/
    http: http`
      HTTP/2 200\x20
      server: cloudflare
      x-github-request-id: A3AA:9FF8:386039:393050:6AD93461
      via: 1.1 varnish
      age: 569
      x-served-by: cache-rtm-ehrd2290029-RTM
      x-cache: HIT
      x-cache-hits: 1
      x-fastly-request-id: 4492459390f4b44def82e575d0a993ed77b774f4
      cf-cache-status: DYNAMIC
      cf-ray: a52e1198cc2e4b92-CPH

    `,
    hops: [
      {
        cloud: 'cloudflare',
        pop: 'CPH',
        country: 'DK',
        cacheStatus: 'DYNAMIC',
      },
      {
        cloud: 'fastly',
        pop: 'RTM',
        country: 'NL',
        cacheStatus: 'HIT',
      },
    ],
  },
  {
    spec: 'infer the Cloudflare POP and its cache status',
    http: http`
      HTTP/1.1 200 OK
      cf-ray: a4d970a44c6e5b3f-KBP
      cf-cache-status: HIT
      cache-control: max-age=10
      server: cloudflare

    `,
    hops: [
      { cloud: 'cloudflare', pop: 'KBP', country: 'UA', cacheStatus: 'HIT' },
    ],
  },
  {
    spec: 'infer no cache status when Cloudflare reports none',
    http: http`
      HTTP/2 200\x20
      cache-control: public, max-age=0, must-revalidate
      server: cloudflare
      cf-ray: a4d98c104f710ee3-CPH

    `,
    hops: [
      { cloud: 'cloudflare', pop: 'CPH', country: 'DK', cacheStatus: null },
    ],
  },
  {
    spec: 'infer a hop per cf-ray in order',
    http: http`
      HTTP/1.1 200 OK
      cf-ray: a4d970a44c6e5b3f-KBP
      cf-cache-status: HIT
      cf-ray: a4d98c104f710ee3-CPH
      cf-cache-status: MISS

    `,
    hops: [
      { cloud: 'cloudflare', pop: 'KBP', country: 'UA', cacheStatus: 'HIT' },
      { cloud: 'cloudflare', pop: 'CPH', country: 'DK', cacheStatus: 'MISS' },
    ],
  },
  {
    spec: 'fall back to ZZ for an unknown POP',
    http: http`
      HTTP/1.1 200 OK
      cf-ray: a4d970a44c6e5b3f-XXX
      cf-cache-status: HIT

    `,
    hops: [
      { cloud: 'cloudflare', pop: 'XXX', country: 'ZZ', cacheStatus: 'HIT' },
    ],
  },
  {
    spec: 'infer only Cloudflare when x-served-by is not from Fastly',
    // https://www.cloudflare.com/
    http: http`
      HTTP/2 200\x20
      cf-ray: a52e0f38badc4b92-CPH
      cf-cache-status: HIT
      age: 7
      server: cloudflare
      x-served-by: marketing-site

    `,
    hops: [
      { cloud: 'cloudflare', pop: 'CPH', country: 'DK', cacheStatus: 'HIT' },
    ],
  },
  {
    spec: 'infer the AWS POP and its cache status',
    // https://www.workday.com/
    http: http`
      HTTP/2 200\x20
      server: Apache
      x-cache: Hit from cloudfront
      via: 1.1 a4a2a9a9be5aed3a967d553b5c56d1d6.cloudfront.net (CloudFront)
      x-amz-cf-pop: CPH50-P3

    `,
    hops: [
      {
        cloud: 'aws',
        pop: 'CPH',
        country: 'DK',
        cacheStatus: 'Hit from cloudfront',
      },
    ],
  },
  {
    spec: 'infer only AWS without x-served-by',
    // https://aws.amazon.com/
    http: http`
      HTTP/2 200\x20
      server: Server
      x-cache: Miss from cloudfront
      via: 1.1 60efd4e24b8d307147e7301a21afb61e.cloudfront.net (CloudFront)
      x-amz-cf-pop: CPH50-P2

    `,
    hops: [
      {
        cloud: 'aws',
        pop: 'CPH',
        country: 'DK',
        cacheStatus: 'Miss from cloudfront',
      },
    ],
  },
  {
    spec: 'infer no cache status when x-cache is not from AWS',
    http: http`
      HTTP/2 200\x20
      x-cache: HIT: 8
      x-amz-cf-pop: FRA53-C1

    `,
    hops: [{ cloud: 'aws', pop: 'FRA', country: 'DE', cacheStatus: null }],
  },
  {
    spec: 'infer the AWS POP without a tier',
    http: http`
      HTTP/2 200\x20
      x-amz-cf-pop: SHA

    `,
    hops: [{ cloud: 'aws', pop: 'SHA', country: 'CN', cacheStatus: null }],
  },
  {
    spec: 'infer no hop from a malformed AWS POP',
    http: http`
      HTTP/2 200\x20
      x-amz-cf-pop: cache-AMS1-C1

    `,
    hops: [],
  },
  {
    spec: 'infer no hop without an AWS POP',
    http: http`
      HTTP/2 200\x20
      x-cache: Miss from cloudfront

    `,
    hops: [],
  },
  {
    spec: 'infer the Fastly POP and its cache status',
    // https://pages.github.com/
    http: http`
      HTTP/2 200\x20
      server: GitHub.com
      via: 1.1 varnish
      x-served-by: cache-rtm-ehrd2290057-RTM
      x-cache: HIT
      x-cache-hits: 1

    `,
    hops: [{ cloud: 'fastly', pop: 'RTM', country: 'NL', cacheStatus: 'HIT' }],
  },
  {
    spec: 'infer the Fastly edge ahead of the shield',
    // https://www.fastly.com/
    http: http`
      HTTP/2 200\x20
      x-served-by: cache-sjc10071-SJC, cache-rtm-ehrd2290021-RTM
      x-cache: HIT, MISS
      x-cache-hits: 15, 0

    `,
    hops: [
      { cloud: 'fastly', pop: 'RTM', country: 'NL', cacheStatus: 'MISS' },
      { cloud: 'fastly', pop: 'SJC', country: 'US', cacheStatus: 'HIT' },
    ],
  },
  {
    spec: 'infer no Fastly cache status when the counts differ',
    // https://www.nytimes.com/
    http: http`
      HTTP/2 403\x20
      server: DataDome
      x-served-by: cache-rtm-ehrd2290047-RTM, cache-rtm-ehrd2290047-RTM, cache-rtm-ehrd2290047-RTM
      x-cache: MISS, MISS

    `,
    hops: [
      { cloud: 'fastly', pop: 'RTM', country: 'NL', cacheStatus: null },
      { cloud: 'fastly', pop: 'RTM', country: 'NL', cacheStatus: null },
      { cloud: 'fastly', pop: 'RTM', country: 'NL', cacheStatus: null },
    ],
  },
];

const it = test.each(fixture);
it('should $spec', async ({ http, hops }) => {
  // Arrange
  const { headers } = parse(http);

  // Act
  const inferred = await clouds.infer(toHeaderMap(headers));

  // Assert
  expect(inferred).toEqual(hops);
  expect(airports.locate).toHaveBeenCalledExactlyOnceWith(
    hops.map((h) => h.pop),
  );
});
