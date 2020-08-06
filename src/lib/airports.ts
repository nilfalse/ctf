interface Airport {
  continent?: string;
  iso_country: string;
  iso_region: string;
}

export let load = function () {
  const dataPromise = fetch('/data/airports.json').then<{
    [key: string]: Airport;
  }>((r) => r.json());

  load = () => dataPromise;
  return dataPromise;
};
