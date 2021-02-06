export const state = 'success';

export const request = {
  url: 'https://peakon.com/',
  ip: '104.26.7.76',
  headers: [
    { name: 'x-powered-by', value: 'WP Engine' },
    { name: 'x-cacheable', value: 'SHORT' },
    { name: 'x-cache', value: 'HIT: 8' },
    { name: 'x-cache-group', value: 'normal' },
    { name: 'x-orig-cache-control', value: 'max-age=0' },
    { name: 'cf-cache-status', value: 'DYNAMIC' },
    { name: 'cf-request-id', value: '050505050500000ebebebebeb0000001' },
    { name: 'server', value: 'cloudflare' },
    { name: 'cf-ray', value: '5e5e5e5e5e5e5e5e7-FRA' },
  ],
};

export const traceroute = [
  {
    heuristic: 'cloudflare',
    score: 1,
    isoCountry: 'DE',
    isoRegion: 'DE-HE',
    continent: 'EU',
    extra: { ray: 'FRA', cacheStatus: 'DYNAMIC' },
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
