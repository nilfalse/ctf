import { CountryRequest } from '../country_request';

export interface Match {
  score: number;
  isoCountry: string;
  isoRegion: string | null;
  continent: string | null;

  extra: null | {
    [key: string]: any;
  };
}

export interface BaseHeuristic {
  resolve(request: CountryRequest): Promise<ReadonlyArray<Match>>;
}
