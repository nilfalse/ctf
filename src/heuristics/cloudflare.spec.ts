import { CountryRequest } from '../country_request';
import * as airports from '../lib/airports';
import { CloudflareMatch, resolve } from './cloudflare';

describe('Cloudflare heuristic', () => {
  let spy: jest.SpyInstance;

  beforeEach(() => {
    spy = jest.spyOn(airports, 'findByIATA');
  });

  afterEach(() => {
    spy.mockRestore();
  });

  describe('when resolving', () => {
    describe('with no ray', () => {
      it('should not report any matches', async () => {
        const resolution = await resolve(new CountryRequest({}));

        expect(resolution).toHaveLength(0);
      });
    });

    describe('with an incorrect ray', () => {
      it('should not report any matches', async () => {
        const resolution = await resolve(
          new CountryRequest({
            responseHeaders: [{ name: 'cf-ray', value: 'cache-cph20634-CPH' }],
          })
        );

        expect(resolution).toHaveLength(0);
      });
    });

    describe('with a correct ray', () => {
      let resolutions: ReadonlyArray<CloudflareMatch>;

      beforeEach(async () => {
        spy.mockImplementation(() => ({
          iso_country: 'DK',
          iso_region: 'DK-84',
        }));

        resolutions = await resolve(
          new CountryRequest({
            responseHeaders: [
              { name: 'cf-ray', value: '5be31a7c0944d875-CPH' },
            ],
          })
        );
      });

      it('should lookup the given IATA code', () => {
        expect(spy).toHaveBeenCalledWith('CPH');
      });

      it('should report exactly one match', () => {
        expect(resolutions).toHaveLength(1);
      });

      it('should report expected country code', async () => {
        expect(resolutions[0]).toHaveProperty('isoCountry', 'DK');
      });

      it('should report expected region code', async () => {
        expect(resolutions[0]).toHaveProperty('isoRegion', 'DK-84');
      });
    });
  });
});
