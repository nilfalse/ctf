const queue: Map<number, Promise<unknown>> = new Map();
export function enqueue<T>(key: number, factory: () => Promise<T>) {
  const inflight = queue.get(key) ?? Promise.resolve();

  const next = inflight.then(factory).catch(console.error);
  queue.set(key, next);
  return next;
}

const pending: Map<number, () => Promise<unknown>> = new Map();
// Runs `factory` once nothing is left enqueued for `key`. A newer call
// replaces it if it hasn't started yet; a running one is never cancelled.
export function conflate<T>(key: number, factory: () => Promise<T>) {
  if (!pending.has(key)) {
    settle(key);
  }

  pending.set(key, factory);
}

export function unqueue(key: number) {
  queue.delete(key);
  pending.delete(key);
}

function settle(key: number) {
  const self = enqueue(key, async function () {
    if (!pending.has(key)) {
      return; // unqueued
    }
    if (queue.get(key) !== self) {
      return settle(key); // work was enqueued behind us: go last again
    }

    const factory = pending.get(key)!;
    pending.delete(key);
    return factory();
  });
}
