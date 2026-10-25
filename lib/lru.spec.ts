import { describe, expect, test } from 'vitest';

import { LRU } from './lru.ts';

// `lru` holds a, b, c (oldest first) and is full.
const it = test.extend('lru', async () =>
  new LRU<string, number | undefined>(3).set('a', 1).set('b', 2).set('c', 3),
);

describe('set', () => {
  it('should evict the least recently used entry when full', ({ lru }) => {
    // Arrange

    // Act
    lru.set('d', 4);

    // Assert
    expect(lru.items()).toEqual([
      ['b', 2],
      ['c', 3],
      ['d', 4],
    ]);
  });

  it('should not evict when updating an existing key', ({ lru }) => {
    // Arrange

    // Act
    lru.set('a', 10);

    // Assert
    expect(lru.items()).toEqual([
      ['b', 2],
      ['c', 3],
      ['a', 10],
    ]);
  });

  it('should hold a single entry with max 1', () => {
    // Arrange
    const lru = new LRU<string, number>(1).set('a', 1);

    // Act
    lru.set('b', 2);

    // Assert
    expect(lru.items()).toEqual([['b', 2]]);
  });
});

describe('get', () => {
  it('should protect the entry from eviction', ({ lru }) => {
    // Arrange
    lru.get('a');

    // Act
    lru.set('d', 4);

    // Assert
    expect(Array.from(lru.keys())).toEqual(['c', 'a', 'd']);
  });

  it('should return the value', ({ lru }) => {
    // Arrange

    // Act
    const v = lru.get('b');

    // Assert
    expect(v).toBe(2);
  });

  it('should leave the order alone on a miss', ({ lru }) => {
    // Arrange

    // Act
    const v = lru.get('z');

    // Assert
    expect(v).toBeUndefined();
    expect(Array.from(lru.keys())).toEqual(['a', 'b', 'c']);
  });

  it('should bump a key stored with an undefined value', ({ lru }) => {
    // Arrange
    lru.set('u', undefined); // evicts a

    // Act
    lru.get('u');
    lru.set('d', 4);

    // Assert
    expect(Array.from(lru.keys())).toEqual(['c', 'u', 'd']);
  });
});
