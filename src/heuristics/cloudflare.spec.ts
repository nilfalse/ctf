import * as common from '../common';
import { CountryRequest } from '../country_request';
import * as cloudflare from './cloudflare';

jest.mock('../lib/airports');

describe('Cloudflare heuristic', () => {
  describe('when resolving', () => {
    describe('with no ray', () => {
      it('should not report any matches', () => {
        return expect(
          cloudflare.resolve(new CountryRequest({}))
        ).resolves.toHaveLength(0);
      });
    });

    describe('with an incorrect ray', () => {
      describe('of more than two components', () => {
        it('should not report any matches', () => {
          const request = new CountryRequest({
            responseHeaders: [{ name: 'cf-ray', value: 'cache-cph20634-CPH' }],
          });

          return expect(cloudflare.resolve(request)).resolves.toHaveLength(0);
        });
      });
      describe('of less than two components', () => {
        it('should not report any matches', () => {
          const request = new CountryRequest({
            responseHeaders: [{ name: 'cf-ray', value: 'CPH' }],
          });

          return expect(cloudflare.resolve(request)).resolves.toHaveLength(0);
        });
      });
    });

    describe('with a correct ray that contains non-existing IATA code', () => {
      it('should not report any matches', () => {
        const request = new CountryRequest({
          responseHeaders: [{ name: 'cf-ray', value: '5be31a7c0944d875-ZZZ' }],
        });

        return expect(cloudflare.resolve(request)).resolves.toHaveLength(0);
      });
    });

    describe('with a correct ray', () => {
      let request: CountryRequest;

      beforeEach(() => {
        request = new CountryRequest({
          responseHeaders: [{ name: 'cf-ray', value: '5be31a7c0944d875-CPH' }],
        });
      });

      it('should report exactly one match', () => {
        return expect(cloudflare.resolve(request)).resolves.toHaveLength(1);
      });

      it('should report expected country code', async () => {
        const [resolution] = await cloudflare.resolve(request);
        expect(resolution).toHaveProperty('isoCountry', 'DK');
      });

      it('should report expected region code', async () => {
        const [resolution] = await cloudflare.resolve(request);
        expect(resolution).toHaveProperty('isoRegion', 'DK-84');
      });

      it('should contain ray in the reported results', async () => {
        const [resolution] = await cloudflare.resolve(request);
        expect(resolution).toHaveProperty('extra.ray', 'CPH');
      });
    });
  });

  describe('when looking up the airport', () => {
    let spy: jest.SpyInstance;

    beforeEach(() => {
      spy = jest.spyOn(common, 'lookupUpperCase');
    });

    afterEach(() => {
      spy.mockRestore();
    });

    it('should use the airport code from request', async () => {
      const request = new CountryRequest({
        responseHeaders: [
          {
            name: 'cf-ray',
            value: '5be31a7c0944d875-CPH',
          },
        ],
      });
      const ignored = await cloudflare.resolve(request);

      const [, iataCode] = spy.mock.calls[0];
      expect(iataCode).toBe('CPH');

      const airport = spy.mock.results[0].value;
      expect(airport).toHaveProperty('iso_country', 'DK');
      expect(airport).toHaveProperty('iso_region', 'DK-84');
      expect(airport).toHaveProperty('continent', 'EU');
    });

    it('should find the airport regardless of letter case', async () => {
      const request = new CountryRequest({
        responseHeaders: [
          {
            name: 'cf-ray',
            value: '5be31a7c0944d875-Cph',
          },
        ],
      });
      const ignored = await cloudflare.resolve(request);
      const airport = spy.mock.results[0].value;

      expect(airport).toHaveProperty('iso_country', 'DK');
      expect(airport).toHaveProperty('iso_region', 'DK-84');
      expect(airport).toHaveProperty('continent', 'EU');
    });

    it('should not find airport unless it exists', async () => {
      const request = new CountryRequest({
        responseHeaders: [
          {
            name: 'cf-ray',
            value: '5be31a7c0944d875-XXX',
          },
        ],
      });
      const ignored = await cloudflare.resolve(request);

      const [, iataCode] = spy.mock.calls[0];
      expect(iataCode).toBe('XXX');

      const airport = spy.mock.results[0].value;
      expect(airport).toBeNull();
    });
  });

  describe('when scoring', () => {
    describe('and server is Cloudflare', () => {
      it('should give top score', async () => {
        const request = new CountryRequest({
          responseHeaders: [
            { name: 'server', value: 'cloudflare' },
            { name: 'cf-ray', value: '5be31a7c0944d875-CPH' },
          ],
        });
        const [resolution] = await cloudflare.resolve(request);

        expect(resolution.score).toBeCloseTo(1.0);
      });

      it('should ignore letter case', async () => {
        const request = new CountryRequest({
          responseHeaders: [
            { name: 'server', value: 'CloudFlare' },
            { name: 'cf-ray', value: '5be31a7c0944d875-CPH' },
          ],
        });
        const [resolution] = await cloudflare.resolve(request);

        expect(resolution.score).toBeCloseTo(1.0);
      });
    });

    describe('and server is not Cloudflare', () => {
      it('should give lower score', async () => {
        const request = new CountryRequest({
          responseHeaders: [
            { name: 'server', value: 'Server' },
            { name: 'cf-ray', value: '5be31a7c0944d875-CPH' },
          ],
        });
        const [resolution] = await cloudflare.resolve(request);

        expect(resolution.score).toBeCloseTo(0.75);
      });
    });
  });

  describe('when analyzing Cache Status', () => {
    const validCacheStatuses = ['HIT', 'MISS', 'BYPASS', 'EXPIRED', 'DYNAMIC'];

    describe('for a valid one', () => {
      it('should report it back', async () => {
        for (const status of validCacheStatuses) {
          const request = new CountryRequest({
            responseHeaders: [
              { name: 'cf-ray', value: '5be31a7c0944d875-CPH' },
              { name: 'cf-cache-status', value: status },
            ],
          });

          const [resolution] = await cloudflare.resolve(request);
          expect(resolution).toHaveProperty('extra.cacheStatus', status);
        }
      });
    });

    describe('for an invalid one', () => {
      it('should not report it back', async () => {
        const request = new CountryRequest({
          responseHeaders: [
            { name: 'cf-ray', value: '5be31a7c0944d875-CPH' },
            { name: 'cf-cache-status', value: 'CPH' },
          ],
        });

        const [resolution] = await cloudflare.resolve(request);
        expect(resolution.extra.cacheStatus).toBeNull();
      });
    });
  });
});
