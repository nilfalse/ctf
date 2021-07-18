import { Request } from '../lib/request';
import * as airportService from '../services/airport/airport_service';
import * as common from '../util/common';

import * as cloudflare from './cloudflare';

jest.mock('../services/airport/airport_service');

describe('Cloudflare interceptor', () => {
  beforeAll(airportService.init);

  describe('when dispatching', () => {
    describe('with no ray', () => {
      it('should not report any matches', () =>
        expect(cloudflare.dispatch(new Request({}))).resolves.toHaveLength(0));
    });

    describe('with an incorrect ray', () => {
      describe('of less than two components', () => {
        it('should not report any matches', () => {
          const request = new Request({
            responseHeaders: [{ name: 'cf-ray', value: 'CPH' }],
          });

          return expect(cloudflare.dispatch(request)).resolves.toHaveLength(0);
        });
      });

      describe('of more than two components', () => {
        it('should not report any matches', () => {
          const request = new Request({
            responseHeaders: [{ name: 'cf-ray', value: 'cache-cph20634-CPH' }],
          });

          return expect(cloudflare.dispatch(request)).resolves.toHaveLength(0);
        });
      });

      describe("with IATA code that doesn't exist", () => {
        it('should not report any matches', () => {
          const request = new Request({
            responseHeaders: [
              { name: 'cf-ray', value: '5be31a7c0944d875-ZZZ' },
            ],
          });

          return expect(cloudflare.dispatch(request)).resolves.toHaveLength(0);
        });
      });
    });

    describe('with a correct ray', () => {
      let request: Request;

      beforeEach(() => {
        request = new Request({
          responseHeaders: [{ name: 'cf-ray', value: '5be31a7c0944d875-CPH' }],
        });
      });

      it('should report exactly one match', () => {
        return expect(cloudflare.dispatch(request)).resolves.toHaveLength(1);
      });

      it('should report expected country code', async () => {
        const [match] = await cloudflare.dispatch(request);
        expect(match).toHaveProperty('isoCountry', 'DK');
      });

      it('should report expected region code', async () => {
        const [match] = await cloudflare.dispatch(request);
        expect(match).toHaveProperty('isoRegion', 'DK-84');
      });

      it('should report expected continent', async () => {
        const [match] = await cloudflare.dispatch(request);
        expect(match).toHaveProperty('continent', 'EU');
      });

      it('should contain ray in the reported results', async () => {
        const [match] = await cloudflare.dispatch(request);
        expect(match).toHaveProperty('extra.ray', 'CPH');
      });
    });

    describe('with a ray pointing to partial or missing data', () => {
      let request: Request;
      let spy: jest.SpyInstance;

      beforeEach(() => {
        request = new Request({
          responseHeaders: [{ name: 'cf-ray', value: '5be31a7c0944d875-EKNM' }],
        });

        spy = jest
          .spyOn(
            common as {
              lookupUpperCase: (
                dict: Record<string, airportService.Airport>,
                key: string
              ) => airportService.Airport;
            },
            'lookupUpperCase'
          )
          .mockReturnValue({
            iso_country: 'EU',
            iso_region: 'DK',
          });
      });

      afterEach(() => {
        spy.mockRestore();
      });

      it('should report expected country code', async () => {
        const [match] = await cloudflare.dispatch(request);
        expect(match).toHaveProperty('isoCountry', 'EU');
      });

      it('should report expected region code', async () => {
        const [match] = await cloudflare.dispatch(request);
        expect(match).toHaveProperty('isoRegion', 'DK');
      });

      it('should report expected continent', async () => {
        const [match] = await cloudflare.dispatch(request);
        expect(match.continent).toBeNull();
      });

      it('should contain ray in the reported results', async () => {
        const [match] = await cloudflare.dispatch(request);
        expect(match).toHaveProperty('extra.ray', 'EKNM');
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
      const request = new Request({
        responseHeaders: [
          {
            name: 'cf-ray',
            value: '5be31a7c0944d875-CPH',
          },
        ],
      });
      const ignored = await cloudflare.dispatch(request);

      expect(spy).toHaveBeenCalledWith(expect.any(Object), 'CPH');
      expect(spy).toHaveReturnedWith({
        iso_country: 'DK',
        iso_region: 'DK-84',
        continent: 'EU',
      });
    });

    it('should find the airport regardless of letter case', async () => {
      const request = new Request({
        responseHeaders: [
          {
            name: 'cf-ray',
            value: '5be31a7c0944d875-Cph',
          },
        ],
      });
      const ignored = await cloudflare.dispatch(request);

      expect(spy).toHaveReturnedWith({
        iso_country: 'DK',
        iso_region: 'DK-84',
        continent: 'EU',
      });
    });

    it('should not find airport unless it exists', async () => {
      const request = new Request({
        responseHeaders: [
          {
            name: 'cf-ray',
            value: '5be31a7c0944d875-XXX',
          },
        ],
      });
      const ignored = await cloudflare.dispatch(request);

      expect(spy).toHaveBeenCalledWith(expect.any(Object), 'XXX');
      expect(spy).toHaveReturnedWith(null);
    });
  });

  describe('when scoring', () => {
    describe('and server is Cloudflare', () => {
      it('should give top score', async () => {
        const request = new Request({
          responseHeaders: [
            { name: 'server', value: 'cloudflare' },
            { name: 'cf-ray', value: '5beb64a95813569d-IAD' },
          ],
        });

        const [match] = await cloudflare.dispatch(request);
        expect(match.score).toBeCloseTo(1.0);
      });

      it('should ignore letter case', async () => {
        const request = new Request({
          responseHeaders: [
            { name: 'server', value: 'CloudFlare' },
            { name: 'cf-ray', value: '5beb64a95813569d-IAD' },
          ],
        });

        const [match] = await cloudflare.dispatch(request);
        expect(match.score).toBeCloseTo(1.0);
      });
    });

    describe('and server is not Cloudflare', () => {
      it('should give lower score', async () => {
        const request = new Request({
          responseHeaders: [
            { name: 'server', value: 'Server' },
            { name: 'cf-ray', value: '5beb64a95813569d-IAD' },
          ],
        });

        const [match] = await cloudflare.dispatch(request);
        expect(match.score).toBeCloseTo(0.75);
      });
    });
  });

  describe('when analyzing Cache Status', () => {
    const cacheStatuses = [
      'HIT',
      'MISS',
      'BYPASS',
      'EXPIRED',
      'REVALIDATED',
      'DYNAMIC',
    ];

    describe('if present', () => {
      it('should report it back', async () => {
        for (const status of cacheStatuses) {
          const request = new Request({
            responseHeaders: [
              { name: 'cf-ray', value: '5beb64a95813569d-IAD' },
              { name: 'cf-cache-status', value: status },
            ],
          });

          const [match] = await cloudflare.dispatch(request);
          expect(match).toHaveProperty('extra.cacheStatus', status);
        }
      });
    });

    describe('if not present', () => {
      it('should not report it back', async () => {
        const request = new Request({
          responseHeaders: [
            { name: 'cf-ray', value: '5beb64a95813569d-IAD' },
            { name: 'cf-cache-status', value: '' },
          ],
        });

        const [match] = await cloudflare.dispatch(request);
        expect(match.extra.cacheStatus).toBeNull();
      });
    });
  });
});
