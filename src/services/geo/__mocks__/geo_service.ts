import { promises as fs } from 'fs';
import * as path from 'path';

const originalModule = jest.requireActual('../geo_service');

const reader = fs
  .readFile(
    path.resolve(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      'data',
      'maxmind',
      'GeoLite2-Country.mmdb'
    )
  )
  .then(originalModule.createReader);

jest.spyOn(originalModule, 'load').mockImplementation(() => reader);

module.exports = originalModule;
