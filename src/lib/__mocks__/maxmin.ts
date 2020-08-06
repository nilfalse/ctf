import { promises as fs } from 'fs';

import { CountryResponse, Reader } from 'maxmind';

const originalModule = jest.requireActual('../maxmind');

async function load() {
  return new Reader<CountryResponse>(
    await fs.readFile('../../../data/GeoLite2-Country.mmdb')
  );
}

jest.spyOn(originalModule, 'load').mockReturnValue(load());

module.exports = originalModule;
