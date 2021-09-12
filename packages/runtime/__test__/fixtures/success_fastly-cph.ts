export const state = 'success' as const;

export const request = {
  url: 'https://example.com/',
  ip: '151.101.1.195',
  headers: [
    {
      name: 'x-served-by',
      value: 'cache-cph20643-CPH',
    },
    {
      name: 'x-cache',
      value: 'MISS',
    },
    {
      name: 'x-cache-hits',
      value: '0',
    },
    {
      name: 'x-fastly-request-id',
      value: 'd252eca9b9d3a9449ecff9e552be6dd9f561a360',
    },
  ],
};

export const traceroute = [
  {
    heuristic: 'fastly',
    score: 0.9,
    isoCountry: 'DK',
    isoRegion: 'DK-84',
    continent: 'EU',
    extra: { pop: 'CPH', cacheStatus: 'MISS', cacheHit: '0' },
  },
  {
    heuristic: 'ip',
    score: 0.5,
    isoCountry: 'US',
    isoRegion: null,
    continent: 'NA',
    extra: { registeredCountry: 'US' },
  },
] as const;
