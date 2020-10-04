import { Match } from '../heuristics';
import { CountryRequest } from '../lib/country_request';

export interface TabDetails {
  request: CountryRequest;
  matches: ReadonlyArray<Match>;
}

export const requests: Map<number, CountryRequest> = new Map();

export const tabDetails: Map<number, TabDetails> = new Map();
