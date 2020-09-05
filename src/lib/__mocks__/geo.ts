import { promises as fs } from 'fs';
import * as path from 'path';

const originalModule = jest.requireActual('../geo');

const reader = fs
  .readFile(
    path.resolve(
      __dirname,
      '..',
      '..',
      '..',
      'data',
      'maxmind',
      'GeoLite2-Country.mmdb'
    )
  )
  .then(originalModule.createReader);

jest.spyOn(originalModule, 'load').mockReturnValue(reader);

module.exports = originalModule;
