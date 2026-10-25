import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import * as q from './q.ts';

const TAB = 1;
const OTHER_TAB = 2;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

beforeEach(() => vi.useFakeTimers());

afterEach(() => {
  q.unqueue(TAB);
  q.unqueue(OTHER_TAB);
  vi.useRealTimers();
});

const it = test
  .extend('log', (): string[] => [])
  .extend(
    'task',
    ({ log }) =>
      (name: string, ms = 10) =>
        vi.fn(async () => {
          log.push(`${name}+`);
          await sleep(ms);
          log.push(`${name}-`);
        }),
  );

describe('enqueue', () => {
  it('should run tasks one by one', async ({ log, task }) => {
    // Arrange
    q.enqueue(TAB, task('A'));

    // Act
    q.enqueue(TAB, task('B'));
    await vi.runAllTimersAsync();

    // Assert
    expect(log).toEqual(['A+', 'A-', 'B+', 'B-']);
  });

  it('should maintain independent queues', async ({ log, task }) => {
    // Arrange
    q.enqueue(TAB, task('A', 20));

    // Act
    q.enqueue(OTHER_TAB, task('B'));
    await vi.runAllTimersAsync();

    // Assert
    expect(log).toEqual(['A+', 'B+', 'B-', 'A-']);
  });

  it('should run after a failed task', async ({ log, task }) => {
    // Arrange
    const error = new Error('dns');
    const report = vi.spyOn(console, 'error').mockImplementation(() => {});
    q.enqueue(TAB, () => Promise.reject(error));

    // Act
    q.enqueue(TAB, task('A'));
    await vi.runAllTimersAsync();

    // Assert
    expect(log).toEqual(['A+', 'A-']);
    expect(report).toHaveBeenCalledExactlyOnceWith(error);
  });
});

describe('conflate', () => {
  it('should run after the enqueued work', async ({ log, task }) => {
    // Arrange

    // Act
    q.conflate(TAB, task('P'));
    q.enqueue(TAB, task('W'));
    await vi.runAllTimersAsync();

    // Assert
    expect(log).toEqual(['W+', 'W-', 'P+', 'P-']);
  });

  it('should wait for work enqueued after it', async ({ log, task }) => {
    // Firefox: `complete` arrives before the response.
    // Arrange
    q.enqueue(TAB, task('W1'));

    // Act
    q.conflate(TAB, task('P'));
    q.enqueue(TAB, task('W2'));
    await vi.runAllTimersAsync();

    // Assert
    expect(log).toEqual(['W1+', 'W1-', 'W2+', 'W2-', 'P+', 'P-']);
  });

  it('should replace a call that has not started', async ({ log, task }) => {
    // Arrange
    const first = task('P1');
    q.enqueue(TAB, task('W'));
    q.conflate(TAB, first);

    // Act
    q.conflate(TAB, task('P2'));
    await vi.runAllTimersAsync();

    // Assert
    expect(first).not.toHaveBeenCalled();
    expect(log).toEqual(['W+', 'W-', 'P2+', 'P2-']);
  });

  it('should queue after an already running conflate', async ({
    log,
    task,
  }) => {
    // Arrange
    q.conflate(TAB, task('P1'));
    await vi.advanceTimersByTimeAsync(5); // P1 is now running
    expect(log).toEqual(['P1+']);

    // Act
    q.conflate(TAB, task('P2'));
    await vi.runAllTimersAsync();

    // Assert
    expect(log).toEqual(['P1+', 'P1-', 'P2+', 'P2-']);
  });

  it('should run after the task that called it', async ({ log, task }) => {
    // FEATURE_EVENTS_OUT_OF_ORDER: the response handler conflates the action render

    // Arrange

    // Act
    q.enqueue(TAB, async () => {
      q.conflate(TAB, task('P'));
      await task('W')();
    });
    await vi.runAllTimersAsync();

    // Assert
    expect(log).toEqual(['W+', 'W-', 'P+', 'P-']);
  });
});

describe('unqueue', () => {
  it('should discard a pending conflate', async ({ log, task }) => {
    // Arrange
    const expensive = task('P');
    q.enqueue(TAB, task('W'));
    q.conflate(TAB, expensive);

    // Act
    q.unqueue(TAB);
    await vi.runAllTimersAsync();

    // Assert
    expect(expensive).not.toHaveBeenCalled();
    expect(log).toEqual(['W+', 'W-']);
  });
});
