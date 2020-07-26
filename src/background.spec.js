import { promises as fs } from 'fs';
import * as path from 'path';

import * as maxmind from 'maxmind';

import * as background from './background';

describe('Background script', () => {
  it('should initialize listeners', async () => {
    const geoip = new maxmind.Reader(
      await fs.readFile(
        path.resolve(__dirname, '..', 'data', 'GeoLite2-Country.mmdb')
      )
    );
    const browser = {
      webRequest: { onCompleted: { addListener() {} } },
    };

    const spy = jest.spyOn(browser.webRequest.onCompleted, 'addListener');

    background.init({
      browser,
      geoip,
    });

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
