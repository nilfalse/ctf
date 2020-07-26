let fetchAirports = async function () {
  const response = await fetch('data/airports.json');
  const data = (await response.json()) as { [key: string]: any };

  fetchAirports = async () => data;
  return data;
};

export async function parse(res: chrome.webRequest.WebResponseCacheDetails) {
  const indexedAirports = await fetchAirports();

  if (!res.responseHeaders) {
    return null;
  }

  const header = res.responseHeaders.find(
    ({ name }) => name.toLowerCase() === 'cf-ray'
  );
  if (!header || !header.value) {
    return null;
  }

  const ray = header.value.split('-');
  if (ray.length !== 2) {
    return null;
  }

  const iata = ray[1];
  return indexedAirports[iata];
}
