export class Repository<T> {
  private _storage: Map<number, T>;

  constructor() {
    this._storage = new Map();
  }

  fetch(id: number): T | null {
    return this._storage.has(id) ? (this._storage.get(id) as T) : null;
  }

  update(id: number, value: T) {
    this._storage.set(id, value);
  }

  remove(id: number) {
    this._storage.delete(id);
  }
}
