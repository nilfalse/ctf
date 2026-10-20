import { parse } from 'http-z';
import { outdent } from 'outdent';
import { expect, it, vi } from 'vitest';

import * as airports from '~/lib/airports.ts';

import * as clouds from './index.ts';

vi.mock('~/lib/airports.ts');

const http = outdent({ newline: '\r\n', trimTrailingNewline: false });

it('should infer the Cloudflare POP and its cache status', async () => {
  // Arrange
  const { headers } = parse(http`
    HTTP/1.1 200 OK
    cf-ray: a4d970a44c6e5b3f-KBP
    cf-cache-status: HIT
    cache-control: max-age=10
    server: cloudflare

  `);
  vi.mocked(airports.locate).mockResolvedValue({ KBP: 'UA' });

  // Act
  const hops = await clouds.infer(headers);

  // Assert
  expect(hops).toEqual([
    { cloud: 'cloudflare', pop: 'KBP', country: 'UA', cacheStatus: 'HIT' },
  ]);
});

it('should infer no cache status when Cloudflare reports none', async () => {
  // Arrange
  const { headers } = parse(http`
    HTTP/2 200\x20
    cache-control: public, max-age=0, must-revalidate
    server: cloudflare
    cf-ray: a4d98c104f710ee3-CPH

  `);
  vi.mocked(airports.locate).mockResolvedValue({ CPH: 'DK' });

  // Act
  const hops = await clouds.infer(headers);

  // Assert
  expect(hops).toEqual([
    { cloud: 'cloudflare', pop: 'CPH', country: 'DK', cacheStatus: null },
  ]);
});

it('should infer a hop per cf-ray in order', async () => {
  // Arrange
  const { headers } = parse(http`
    HTTP/1.1 200 OK
    cf-ray: a4d970a44c6e5b3f-KBP
    cf-cache-status: HIT
    cf-ray: a4d98c104f710ee3-CPH
    cf-cache-status: MISS

  `);
  vi.mocked(airports.locate).mockResolvedValue({ KBP: 'UA', CPH: 'DK' });

  // Act
  const hops = await clouds.infer(headers);

  // Assert
  expect(airports.locate).toHaveBeenCalledExactlyOnceWith(['KBP', 'CPH']);
  expect(hops).toEqual([
    { cloud: 'cloudflare', pop: 'KBP', country: 'UA', cacheStatus: 'HIT' },
    { cloud: 'cloudflare', pop: 'CPH', country: 'DK', cacheStatus: 'MISS' },
  ]);
});

it('should fall back to ZZ for an unknown POP', async () => {
  // Arrange
  const { headers } = parse(http`
    HTTP/1.1 200 OK
    cf-ray: a4d970a44c6e5b3f-XXX
    cf-cache-status: HIT

  `);
  vi.mocked(airports.locate).mockResolvedValue({});

  // Act
  const hops = await clouds.infer(headers);

  // Assert
  expect(hops).toEqual([
    { cloud: 'cloudflare', pop: 'XXX', country: 'ZZ', cacheStatus: 'HIT' },
  ]);
});
