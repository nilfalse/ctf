import { fakeBrowser } from '@webext-core/fake-browser';
import type { Mock } from 'vitest';
import { test, beforeEach, describe, expect, vi } from 'vitest';

import * as airports from './airports.ts';

beforeEach(fakeBrowser.reset);

type Response = (body: unknown, init?: ResponseInit) => Mock<typeof fetch>;
const it = test.extend<{ mock: Response }>({
  mock: async ({}, use) =>
    use(function (body, init) {
      const fetch = vi.fn(async () => Response.json(body, init));
      vi.stubGlobal('fetch', fetch);
      return fetch;
    }),
});

describe('populate', () => {
  it('should store the country of each airport', async ({ mock }) => {
    // Arrange
    const fetch = mock({
      CPH: { country: 'DK', region: '84' },
      KBP: { country: 'UA', region: '32' },
    });

    // Act
    await airports.populate();

    // Assert
    expect(fetch).toHaveBeenCalledExactlyOnceWith(
      new URL('https://cdn.test/base/datasets/airports.json'),
    );
    expect(await fakeBrowser.storage.local.get()).toEqual({
      CPH: 'DK',
      KBP: 'UA',
    });
  });

  it('should overwrite previously stored airports', async ({ mock }) => {
    // Arrange
    await fakeBrowser.storage.local.set({ CPH: 'DK', ARN: 'DK' });
    mock({ ARN: { country: 'SE', region: 'AB' } });

    // Act
    await airports.populate();

    // Assert
    expect(await fakeBrowser.storage.local.get()).toEqual({
      CPH: 'DK',
      ARN: 'SE',
    });
  });

  it('should log error when the download fails', async ({ mock }) => {
    // Arrange
    await fakeBrowser.storage.local.set({ CPH: 'DK', ARN: 'DK' });
    const err = vi.spyOn(console, 'error').mockImplementation(() => {});
    mock(null, { status: 503 });

    // Act
    const result = airports.populate();

    // Assert
    await expect(result).rejects.toThrow('HTTP fetch failed');
    expect(err).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ status: 503 }),
    );
    expect(await fakeBrowser.storage.local.get()).toEqual({
      CPH: 'DK',
      ARN: 'DK',
    });
  });
});

describe('locate', () => {
  it('should find the countries of the given airports', async ({ mock }) => {
    // Arrange
    mock({
      CPH: { country: 'DK', region: '84' },
      KBP: { country: 'UA', region: '32' },
      NRT: { country: 'JP', region: '12' },
    });
    await airports.populate();

    // Act
    const result = await airports.locate(['CPH', 'NRT']);

    // Assert
    expect(result).toEqual({ CPH: 'DK', NRT: 'JP' });
  });

  it('should omit unknown airports', async ({ mock }) => {
    // Arrange
    mock({ CPH: { country: 'DK', region: '84' } });
    await airports.populate();

    // Act
    const result = await airports.locate(['CPH', 'XXX']);

    // Assert
    expect(result).toEqual({ CPH: 'DK' });
  });

  it('should find nothing before populating', async () => {
    // Arrange

    // Act
    const result = await airports.locate(['CPH']);

    // Assert
    expect(result).toEqual({});
  });
});
