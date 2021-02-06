export interface Match {
  score: number;
  isoCountry: string;
  isoRegion: string | null;
  continent: string | null;

  extra: null | {
    [key: string]: unknown;
  };
}
