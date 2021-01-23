import { Match } from '../interceptors';
import { CountryRequest } from '../lib/country_request';

export interface TabDetails {
  request: CountryRequest;
  matches: ReadonlyArray<Match>;
}

class Repository<T> {
  private _storage: Map<number, T>;

  constructor() {
    this._storage = new Map();
  }

  update(id: number, value: T | null) {
    if (value !== null) {
      this._storage.set(id, value);
    } else {
      this._storage.delete(id);
    }
  }

  fetch(id: number): T | null {
    return this._storage.has(id) ? this._storage.get(id) : null;
  }

  isEmpty() {
    return this._storage.size === 0;
  }
}

export const requests = new Repository<CountryRequest>();

export const tabDetails = new Repository<TabDetails>();
