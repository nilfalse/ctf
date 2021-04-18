import { Reader, CountryResponse } from 'maxmind';

export let db: Reader<CountryResponse> | null = null;

let databasePromise: Promise<void> | null = null;
export function init() {
  if (!databasePromise) {
    databasePromise = _load()
      .then(createReader)
      .then((reader) => {
        db = reader;
      });
  }

  return databasePromise;
}

export function _load() {
  return fetch('/data/GeoLite2-Country.mmdb').then(responseToBuffer);
}

function createReader(db: Buffer) {
  return new Reader<CountryResponse>(db);
}

async function responseToBuffer(response: Response) {
  const db = Buffer.from(await response.arrayBuffer());
  // @ts-expect-error Monkey-patch the Buffer since `maxmind` relies on this undocumented method
  db.utf8Slice = function (start?: number, end?: number) {
    return this.toString('utf8', start, end);
  };

  return db;
}
