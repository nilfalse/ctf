import * as airportService from '../airport/airport_service';
import * as emojiService from '../emoji/emoji_service';
import * as geoService from '../geo/geo_service';
import { defaultIconPromise } from '../icon/icon_service';

import * as reportService from './report_service';

jest.mock('../airport/airport_service');
jest.mock('../geo/geo_service');

jest.mock('../env/env_service', () => ({
  supportsActionSVG: true,
}));

describe('Report service', () => {
  beforeAll(airportService.init);
  beforeAll(emojiService.init);
  beforeAll(geoService.init);

  describe('when payload has no meaningful data', () => {
    it('should collect empty report', async () => {
      const report = await reportService.collect({});

      expect(report).toHaveProperty('isEmpty', true);
      expect(report).toHaveProperty('icon', defaultIconPromise);
    });
  });

  describe('when payload has Ukrainian IP', () => {
    it('should render Ukrainian flag icon', async () => {
      const report = await reportService.collect({
        ip: '195.64.225.67',
      });

      expect(await report.icon).toStrictEqual({
        path: '/assets/twemoji/ua.svg',
      });
    });
  });

  describe('when payload contains Danish Cloudflare traces', () => {
    it('should return Danish flag emoji', async () => {
      const report = await reportService.collect({
        responseHeaders: [{ name: 'cf-ray', value: '5be31a7c0944d875-CPH' }],
      });

      expect(report).toHaveProperty('flag', {
        emoji: '🇩🇰',
        image:
          'https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/DK.svg',
        name: 'Denmark',
        unicode: 'U+1F1E9 U+1F1F0',
      });
    });
  });
});
