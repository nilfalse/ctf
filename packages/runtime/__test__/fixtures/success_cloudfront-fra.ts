export const state = 'success' as const;

export const request = {
  url: 'https://www.workday.com/',
  ip: '143.204.202.99',
  headers: [
    {
      name: 'Server',
      value: 'Apache',
    },
    {
      name: 'X-Cache',
      value: 'Miss from cloudfront',
    },
    {
      name: 'Via',
      value: '1.1 1764af62d635a1a6ee51aabc37405452.cloudfront.net (CloudFront)',
    },
    {
      name: 'X-Amz-Cf-Pop',
      value: 'FRA53-C1',
    },
    {
      name: 'X-Amz-Cf-Id',
      value: 'XXWLOSXVpyCPH_qWH_e61SK44oFpgwRyAst9DnHWCKlxjC8Dm6f7uw==',
    },
  ],
};

export const traceroute = [
  {
    heuristic: 'cloudfront',
    score: 1,
    isoCountry: 'DE',
    isoRegion: 'DE-HE',
    continent: 'EU',
    extra: { pop: 'FRA', cacheStatus: 'Miss from cloudfront' },
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
