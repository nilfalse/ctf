import { fakeBrowser } from '@webext-core/fake-browser';
import { test, beforeEach, describe, expect, vi } from 'vitest';

import * as edges from './edges.ts';

beforeEach(fakeBrowser.reset);

const it = test.extend(
  'mock',
  async () =>
    function (body: unknown, init?: ResponseInit) {
      const stub = vi.fn<typeof fetch>(async () => Response.json(body, init));
      vi.stubGlobal('fetch', stub);
      return stub;
    },
);

describe('populate', () => {
  it('should store the country of each airport', async ({ mock }) => {
    // Arrange
    const fetch = mock({
      CPH: { country: 'DK', region: 'DK-84' },
      KBP: { country: 'UA', region: 'UA-32' },
    });

    // Act
    await edges.refreshEdges();

    // Assert
    expect(fetch).toHaveBeenCalledExactlyOnceWith(
      new URL('https://cdn.test/base/datasets/edges.json'),
      { signal: expect.any(AbortSignal) },
    );
    expect(await fakeBrowser.storage.local.get()).toEqual({
      edge_CPH: 'DK',
      edge_KBP: 'UA',
    });
  });

  it('should overwrite previously stored airports', async ({ mock }) => {
    // Arrange
    await fakeBrowser.storage.local.set({ edge_CPH: 'DK', edge_ARN: 'DK' });
    mock({
      CPH: { country: 'DK', region: 'DK-84' },
      ARN: { country: 'SE', region: 'SE-AB' },
    });

    // Act
    await edges.refreshEdges();

    // Assert
    expect(await fakeBrowser.storage.local.get()).toEqual({
      edge_CPH: 'DK',
      edge_ARN: 'SE',
    });
  });

  it('should log error when the download fails', async ({ mock }) => {
    // Arrange
    await fakeBrowser.storage.local.set({ edge_CPH: 'DK', edge_ARN: 'DK' });
    const err = vi.spyOn(console, 'error').mockImplementation(() => {});
    mock(null, { status: 503 });

    // Act
    const result = edges.refreshEdges();

    // Assert
    await expect(result).rejects.toThrow('HTTP fetch failed');
    expect(err).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ status: 503 }),
    );
    expect(await fakeBrowser.storage.local.get()).toEqual({
      edge_CPH: 'DK',
      edge_ARN: 'DK',
    });
  });
});

describe('locate', () => {
  it('should find the countries of the given airports', async ({ mock }) => {
    // Arrange
    mock({
      CPH: { country: 'DK', region: 'DK-84' },
      KBP: { country: 'UA', region: 'UA-32' },
      NRT: { country: 'JP', region: 'JP-12' },
    });
    await edges.refreshEdges();

    // Act
    const result = await edges.locate(['CPH', 'NRT']);

    // Assert
    expect(result).toEqual({ CPH: 'DK', NRT: 'JP' });
  });

  it('should omit unknown airports', async ({ mock }) => {
    // Arrange
    mock({ CPH: { country: 'DK', region: 'DK-84' } });
    await edges.refreshEdges();

    // Act
    const result = await edges.locate(['CPH', 'XXX']);

    // Assert
    expect(result).toEqual({ CPH: 'DK' });
  });

  it('should find nothing before populating', async () => {
    // Arrange

    // Act
    const result = await edges.locate(['CPH']);

    // Assert
    expect(result).toEqual({});
  });
});
