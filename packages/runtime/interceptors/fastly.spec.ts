import { Request } from '../lib/request';
import * as airportService from '../services/airport/airport_service';
import * as common from '../util/common';

import * as fastly from './fastly';

jest.mock('../services/airport/airport_service');

// https://developer.fastly.com/reference/http-headers/X-Served-By/

describe('Fastly interceptor', () => {
  beforeAll(airportService.init);

  describe('when dispatching', () => {
    describe('with single hop', () => {
      describe('with no POP', () => {
        it('should not report any matches', () =>
          expect(fastly.dispatch(new Request({}))).resolves.toHaveLength(0));
      });

      describe('with an incorrect POP header', () => {
        describe('with missing 3rd component', () => {
          it('should not report any matches', () => {
            const request = new Request({
              responseHeaders: [{ name: 'x-served-by', value: 'cache-ams1' }],
            });

            return expect(fastly.dispatch(request)).resolves.toHaveLength(0);
          });
        });

        describe('with non-matching POPs', () => {
          it('should not report any matches', () => {
            const request = new Request({
              responseHeaders: [
                { name: 'x-served-by', value: 'cache-kbp1-IEV' },
              ],
            });

            return expect(fastly.dispatch(request)).resolves.toHaveLength(0);
          });
        });

        describe('with an extra 4th components', () => {
          it('should not report any matches', () => {
            const request = new Request({
              responseHeaders: [
                { name: 'x-served-by', value: 'cache-C1-ams20620-AMS' },
              ],
            });

            return expect(fastly.dispatch(request)).resolves.toHaveLength(0);
          });
        });

        describe("with IATA code that doesn't exist", () => {
          it('should not report any matches', () => {
            const request = new Request({
              responseHeaders: [
                { name: 'x-served-by', value: 'cache-ZZZ1-zzz' },
              ],
            });

            return expect(fastly.dispatch(request)).resolves.toHaveLength(0);
          });
        });
      });

      describe('with a correct POP', () => {
        let request: Request;

        describe('of three component', () => {
          beforeEach(() => {
            request = new Request({
              responseHeaders: [
                { name: 'x-served-by', value: 'cache-cph20621-CPH' },
              ],
            });
          });

          it('should report exactly one match', () => {
            return expect(fastly.dispatch(request)).resolves.toHaveLength(1);
          });

          it('should report expected country code', async () => {
            const [match] = await fastly.dispatch(request);
            expect(match).toHaveProperty('isoCountry', 'DK');
          });

          it('should report expected region code', async () => {
            const [match] = await fastly.dispatch(request);
            expect(match).toHaveProperty('isoRegion', 'DK-84');
          });

          it('should report expected continent', async () => {
            const [match] = await fastly.dispatch(request);
            expect(match).toHaveProperty('continent', 'EU');
          });

          it('should contain POP in the reported results', async () => {
            const [match] = await fastly.dispatch(request);
            expect(match).toHaveProperty('extra.pop', 'CPH');
          });
        });
      });

      describe('with a POP pointing to partial or missing data', () => {
        let request: Request;
        let spy: jest.SpyInstance;

        beforeEach(() => {
          request = new Request({
            responseHeaders: [
              { name: 'x-served-by', value: 'cache-eknm20621-EKNM' },
            ],
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
          const [match] = await fastly.dispatch(request);
          expect(match).toHaveProperty('isoCountry', 'EU');
        });

        it('should report expected region code', async () => {
          const [match] = await fastly.dispatch(request);
          expect(match).toHaveProperty('isoRegion', 'DK');
        });

        it('should report expected continent', async () => {
          const [match] = await fastly.dispatch(request);
          expect(match.continent).toBeNull();
        });

        it('should contain POP in the reported results', async () => {
          const [match] = await fastly.dispatch(request);
          expect(match).toHaveProperty('extra.pop', 'EKNM');
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
              { name: 'x-served-by', value: 'cache-cph20621-CPH' },
            ],
          });
          const ignored = await fastly.dispatch(request);

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
                name: 'x-served-by',
                value: 'cache-cph20621-Cph',
              },
            ],
          });
          const ignored = await fastly.dispatch(request);

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
                name: 'x-served-by',
                value: 'cache-xxx20621-XXX',
              },
            ],
          });
          const ignored = await fastly.dispatch(request);

          expect(spy).toHaveBeenCalledWith(expect.any(Object), 'XXX');
          expect(spy).toHaveReturnedWith(null);
        });
      });

      describe('when scoring', () => {
        describe('and x-fastly-request-id is present', () => {
          it('should score the highest', async () => {
            const request = new Request({
              responseHeaders: [
                {
                  name: 'x-fastly-request-id',
                  value: 'bbb53a5b5a1b48c07d4f12f53920895929e19ba9',
                },
                {
                  name: 'x-served-by',
                  value: 'cache-cph20637-CPH',
                },
              ],
            });

            const [match] = await fastly.dispatch(request);
            expect(match.score).toBeCloseTo(0.9);
          });
        });

        describe('and x-fastly-request-id header is absent', () => {
          it('should score lower', async () => {
            const request = new Request({
              responseHeaders: [
                { name: 'x-served-by', value: 'cache-cph20620-CPH' },
              ],
            });

            const [match] = await fastly.dispatch(request);
            expect(match.score).toBeCloseTo(0.8);
          });
        });
      });

      describe('when analyzing Cache Status', () => {
        describe('if present', () => {
          it('should report back a miss', async () => {
            const request = new Request({
              responseHeaders: [
                { name: 'x-cache', value: 'MISS' },
                { name: 'x-cache-hits', value: '0' },
                { name: 'x-served-by', value: 'cache-cph20620-CPH' },
              ],
            });

            const [match] = await fastly.dispatch(request);
            expect(match).toHaveProperty('extra.cacheStatus', 'MISS');
            expect(match).toHaveProperty('extra.cacheHit', '0');
          });

          it('should report back 1 hit', async () => {
            const request = new Request({
              responseHeaders: [
                { name: 'x-cache', value: 'HIT' },
                { name: 'x-cache-hits', value: '1' },
                { name: 'x-served-by', value: 'cache-cph20620-CPH' },
              ],
            });

            const [match] = await fastly.dispatch(request);
            expect(match).toHaveProperty('extra.cacheStatus', 'HIT');
            expect(match).toHaveProperty('extra.cacheHit', '1');
          });

          it('should report back several hits', async () => {
            const request = new Request({
              responseHeaders: [
                { name: 'x-cache', value: 'HIT' },
                { name: 'x-cache-hits', value: '2' },
                { name: 'x-served-by', value: 'cache-cph20620-CPH' },
              ],
            });

            const [match] = await fastly.dispatch(request);
            expect(match).toHaveProperty('extra.cacheStatus', 'HIT');
            expect(match).toHaveProperty('extra.cacheHit', '2');
          });
        });

        describe('if not present', () => {
          it('should not report it back', async () => {
            const request = new Request({
              responseHeaders: [
                { name: 'x-cache', value: '' },
                { name: 'x-served-by', value: 'cache-cph20620-CPH' },
              ],
            });

            const [match] = await fastly.dispatch(request);
            expect(match.extra.cacheStatus).toBeNull();
            expect(match.extra.cacheHit).toBeNull();
          });
        });
      });
    });

    describe('with shield server', () => {
      let request: Request;

      // x-served-by: cache-lga21936-LGA, cache-ams21008-AMS
      // x-cache: HIT, MISS
      // x-cache-hits: 1, 0

      beforeEach(() => {
        request = new Request({
          responseHeaders: [
            {
              name: 'x-served-by',
              value: ['cache-lga21936-LGA', 'cache-ams21008-AMS'].join(', '),
            },
            { name: 'x-cache', value: 'HIT, MISS' },
            { name: 'x-cache-hits', value: '1, 0' },
          ],
        });
      });

      it('should report exactly two matches', () => {
        return expect(fastly.dispatch(request)).resolves.toHaveLength(2);
      });

      it('should report expected scores', async () => {
        const [match1, match2] = await fastly.dispatch(request);

        expect(match2.score).toBeCloseTo(0.7);
        expect(match1.score).toBeCloseTo(0.8);
      });

      it('should report expected country codes', async () => {
        const matches = await fastly.dispatch(request);
        expect(matches).toMatchObject([
          { isoCountry: 'US' },
          { isoCountry: 'NL' },
        ]);
      });

      it('should report expected region codes', async () => {
        const matches = await fastly.dispatch(request);
        expect(matches).toMatchObject([
          { isoRegion: 'US-NY' },
          { isoRegion: 'NL-NH' },
        ]);
      });

      it('should report expected continents', async () => {
        const matches = await fastly.dispatch(request);
        expect(matches).toMatchObject([
          { continent: 'NA' },
          { continent: 'EU' },
        ]);
      });

      it('should contain POPs in the reported result', async () => {
        const matches = await fastly.dispatch(request);
        expect(matches).toMatchObject([
          { extra: { pop: 'LGA' } },
          { extra: { pop: 'AMS' } },
        ]);
      });

      it('should report expected cache statuses', async () => {
        const matches = await fastly.dispatch(request);
        expect(matches).toMatchObject([
          { extra: { cacheStatus: 'HIT' } },
          { extra: { cacheStatus: 'MISS' } },
        ]);
      });

      it('should report expected cache hits', async () => {
        const matches = await fastly.dispatch(request);
        expect(matches).toMatchObject([
          { extra: { cacheHit: '1' } },
          { extra: { cacheHit: '0' } },
        ]);
      });
    });
  });
});
