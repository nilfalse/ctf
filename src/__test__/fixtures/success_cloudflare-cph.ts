export const state = 'success' as const;

export const request = {
  url: 'https://ilin.dk/',
  ip: '104.27.165.61',
  headers: [
    {
      name: 'cf-ray',
      value: '5d5d5d5d5d5d5d5d-CPH',
    },
    {
      name: 'cf-cache-status',
      value: 'REVALIDATED',
    },
    {
      name: 'cf-request-id',
      value: '00000004f10000000000000000000001',
    },
    {
      name: 'x-nf-request-id',
      value: 'b1b1b1b1-c9c9-4545-afaf-292929292929-33333333',
    },
    {
      name: 'server',
      value: 'cloudflare',
    },
  ],
};

export const traceroute = [
  {
    heuristic: 'cloudflare',
    score: 1,
    isoCountry: 'DK',
    isoRegion: 'DK-84',
    continent: 'EU',
    extra: { ray: 'CPH', cacheStatus: 'REVALIDATED' },
  },
  {
    heuristic: 'ip',
    score: 0.5,
    isoCountry: 'US',
    isoRegion: null,
    continent: 'NA',
    extra: null,
  },
] as const;
