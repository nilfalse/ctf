import { Reader, CountryResponse } from 'maxmind';

async function createReader() {
  const response = await fetch('/data/GeoLite2-Country.mmdb');
  const db = Buffer.from(await response.arrayBuffer());
  // @ts-expect-error
  db.utf8Slice = function (start?: number, end?: number) {
    return this.toString('utf8', start, end);
  };

  return new Reader<CountryResponse>(db);
}

export let load = () => {
  const databasePromise = createReader();

  load = () => databasePromise;
  return databasePromise;
};
