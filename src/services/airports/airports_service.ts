interface Airport {
  continent?: string;
  // eslint-disable-next-line camelcase
  iso_country: string;
  // eslint-disable-next-line camelcase
  iso_region: string;
}

export let load = function (): Promise<Record<string, Airport>> {
  const dataPromise = fetch('/data/airports.json').then((r) => r.json());

  load = () => dataPromise;
  return dataPromise;
};
