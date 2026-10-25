const _queue: Map<number, Promise<unknown>> = new Map();
export function enqueue<T>(key: number, factory: () => Promise<T>) {
  const inflight = _queue.get(key) ?? Promise.resolve();

  const next = inflight.then(factory).catch(console.error);
  _queue.set(key, next);
  return next;
}

const _pending: Map<number, () => Promise<unknown>> = new Map();
// Runs `factory` once nothing is left enqueued for `key`. A newer call
// replaces it if it hasn't started yet; a running one is never cancelled.
export function conflate<T>(key: number, factory: () => Promise<T>) {
  if (!_pending.has(key)) {
    _settle(key);
  }

  _pending.set(key, factory);
}

export function unqueue(key: number) {
  _queue.delete(key);
  _pending.delete(key);
}

function _settle(key: number) {
  const self = enqueue(key, async function () {
    if (!_pending.has(key)) {
      return; // unqueued
    }
    if (_queue.get(key) !== self) {
      return _settle(key); // work was enqueued behind us: go last again
    }

    const factory = _pending.get(key)!;
    _pending.delete(key);
    return factory();
  });
}
