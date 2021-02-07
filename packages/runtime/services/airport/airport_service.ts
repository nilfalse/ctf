import { lookupUpperCase } from '../../util/common';
import * as debug from '../../util/debug';

export interface Airport {
  continent?: string;
  iso_country: string; // eslint-disable-line camelcase
  iso_region: string; // eslint-disable-line camelcase
}

const airports: Record<string, Airport> = {};

let ready = false;

export function lookup(code: string) {
  debug.assert(ready, 'Airports service lookup method was called before init');

  return lookupUpperCase(airports, code);
}

export let _load = function (): Promise<Record<string, Airport>> {
  const dataPromise = fetch('/data/airports.json').then((r) => r.json());

  _load = () => dataPromise;
  return dataPromise;
};

export const init = function (): Promise<Record<string, Airport>> {
  return _load().then((data) => {
    ready = true;

    return Object.assign(airports, data);
  });
};