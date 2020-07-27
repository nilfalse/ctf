import { Reader, CountryResponse } from 'maxmind';

export async function createReader() {
  const response = await fetch('/data/GeoLite2-Country.mmdb');
  const db = Buffer.from(await response.arrayBuffer());
  // @ts-expect-error
  db.utf8Slice = function (start: number | undefined, end: number | undefined) {
    return this.toString('utf8', start, end);
  };

  return new Reader<CountryResponse>(db);
}

export let lazy = () => {
  const databasePromise = createReader();

  lazy = () => databasePromise;
  return databasePromise;
};

export async function lookup(ipAddress: string) {
  const database = await lazy();

  return database.get(ipAddress);
}
