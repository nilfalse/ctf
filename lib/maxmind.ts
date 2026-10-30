import { Buffer } from 'buffer';

import type { CountryResponse } from 'mmdb-lib';
import { Reader } from 'mmdb-lib';

import { cache, cached } from '~/webext/cache.ts';
import fetch from '~/webext/fetch.ts';

interface Whereabouts {
  country: TwoUppercaseLetters | null;
  registered: TwoUppercaseLetters | null;
  represented: TwoUppercaseLetters | null;
}

export async function whereabouts(ip: string) {
  return (_geolite ??= loadGeoLite()).then<Whereabouts>(
    (reader) => {
      const record = reader.get(ip);
      return {
        country: (record?.country?.iso_code as TwoUppercaseLetters) ?? null,
        registered:
          (record?.registered_country?.iso_code as TwoUppercaseLetters) ?? null,
        represented:
          (record?.represented_country?.iso_code as TwoUppercaseLetters) ??
          null,
      };
    },
    (err: unknown) => {
      _geolite = undefined;
      throw err;
    },
  );
}

let _geolite: Promise<Reader<CountryResponse>> | undefined;

export async function loadGeoLite(force?: boolean) {
  const url = 'maxmind/GeoLite2-Country.mmdb';

  let response: Response | undefined;
  if (!force) {
    response = await cached(url);
  }
  if (!response) {
    response = await fetch(url);
    await cache(response);
  }

  return new Reader<CountryResponse>(Buffer.from(await response.arrayBuffer()));
}
