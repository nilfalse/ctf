import { Reader, CountryResponse } from 'maxmind';

export function createReader(db: Buffer) {
  return new Reader<CountryResponse>(db);
}

let databasePromise: Promise<Reader<CountryResponse>> | null = null;
export function load() {
  if (!databasePromise) {
    databasePromise = fetch('/data/GeoLite2-Country.mmdb')
      .then(responseToBuffer)
      .then(createReader);
  }

  return databasePromise;
}

async function responseToBuffer(response: Response) {
  const db = Buffer.from(await response.arrayBuffer());
  // @ts-expect-error Monkey-patch webpack's Buffer since maxmind relies on this undocumented method
  db.utf8Slice = function (start?: number, end?: number) {
    return this.toString('utf8', start, end);
  };

  return db;
}
