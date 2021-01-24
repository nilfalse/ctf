export const state = 'success' as const;

export const request = {
  url: 'https://protonmail.com/',
  ip: '185.70.41.35',
};

export const traceroute = [
  {
    heuristic: 'ip',
    score: 0.5,
    isoCountry: 'CH',
    isoRegion: null,
    continent: 'EU',
    extra: { registeredCountry: 'CH' },
  },
] as const;
