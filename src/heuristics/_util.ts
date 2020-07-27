export interface Heuristic extends Match {
  heuristic: string;
}

export interface Match {
  weight: number;
  isoCountry: string;
  isoRegion: string | null;
  continent?: string;
}
