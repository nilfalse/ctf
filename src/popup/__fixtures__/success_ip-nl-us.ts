export const state = 'success';

export const request = {
  url: 'https://duckduckgo.com/',
  ip: '40.114.177.156',
  responseHeaders: [
    { name: 'status', value: '304' },
    { name: 'server', value: 'nginx' },
  ],
};

export const matches = [
  {
    heuristic: 'ip',
    score: 0.5,
    isoCountry: 'NL',
    isoRegion: null,
    continent: 'EU',
    extra: { registeredCountry: 'US' },
  },
];
