import { promises as fs } from 'fs';
import * as path from 'path';

const originalModule = jest.requireActual<{
  rewire$_load: (loader: () => Promise<unknown>) => void;
}>('../geo_service');

originalModule.rewire$_load(() =>
  fs.readFile(
    path.resolve(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      'bundle',
      'data',
      'maxmind',
      'GeoLite2-Country.mmdb'
    )
  )
);

module.exports = originalModule;
