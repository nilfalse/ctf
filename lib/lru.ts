export class LRU<K, V> extends Map<K, V> {
  max: number;

  constructor(max: number) {
    super();
    this.max = max;
  }

  override get(k: K) {
    if (!this.has(k)) {
      return undefined;
    }

    const v = super.get(k) as V;
    super.delete(k);
    super.set(k, v);

    return v;
  }

  override set(k: K, v: V) {
    super.delete(k);

    if (this.size >= this.max) {
      super.delete(this.keys().next().value as K);
    }

    return super.set(k, v);
  }

  static of<K, V>(max: number, entries?: [K, V][]) {
    const cache = new LRU<K, V>(max);

    if (entries) {
      for (const [k, v] of entries) {
        cache.set(k, v);
      }
    }

    return cache;
  }

  items() {
    return Array.from(this.entries());
  }
}
