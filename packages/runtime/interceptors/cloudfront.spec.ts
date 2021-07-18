import { Request } from '../lib/request';
import * as airportService from '../services/airport/airport_service';
import * as common from '../util/common';

import * as cloudfront from './cloudfront';

jest.mock('../services/airport/airport_service');

describe('Amazon CloudFront interceptor', () => {
  beforeAll(airportService.init);

  describe('when dispatching', () => {
    describe('with no POP', () => {
      it('should not report any matches', () =>
        expect(cloudfront.dispatch(new Request({}))).resolves.toHaveLength(0));
    });

    describe('with an incorrect POP header', () => {
      describe('of more than two components', () => {
        it('should not report any matches', () => {
          const request = new Request({
            responseHeaders: [{ name: 'X-Amz-Cf-Pop', value: 'cache-AMS1-C1' }],
          });

          return expect(cloudfront.dispatch(request)).resolves.toHaveLength(0);
        });
      });

      describe("with IATA code that doesn't exist", () => {
        it('should not report any matches', () => {
          const request = new Request({
            responseHeaders: [{ name: 'X-Amz-Cf-Pop', value: 'ZZZ3-C1' }],
          });

          return expect(cloudfront.dispatch(request)).resolves.toHaveLength(0);
        });
      });
    });

    describe('with a correct POP', () => {
      let request: Request;

      describe('of one component', () => {
        beforeEach(() => {
          request = new Request({
            responseHeaders: [{ name: 'X-Amz-Cf-Pop', value: 'SHA' }],
          });
        });

        it('should report exactly one match', () => {
          return expect(cloudfront.dispatch(request)).resolves.toHaveLength(1);
        });

        it('should report expected country code', async () => {
          const [match] = await cloudfront.dispatch(request);
          expect(match).toHaveProperty('isoCountry', 'CN');
        });

        it('should report expected region code', async () => {
          const [match] = await cloudfront.dispatch(request);
          expect(match).toHaveProperty('isoRegion', 'CN-31');
        });

        it('should report expected continent', async () => {
          const [match] = await cloudfront.dispatch(request);
          expect(match).toHaveProperty('continent', 'AS');
        });

        it('should contain POP in the reported results', async () => {
          const [match] = await cloudfront.dispatch(request);
          expect(match).toHaveProperty('extra.pop', 'SHA');
        });
      });

      describe('of two components', () => {
        beforeEach(() => {
          request = new Request({
            responseHeaders: [{ name: 'X-Amz-Cf-Pop', value: 'CPH50-C2' }],
          });
        });

        it('should report exactly one match', () => {
          return expect(cloudfront.dispatch(request)).resolves.toHaveLength(1);
        });

        it('should report expected country code', async () => {
          const [match] = await cloudfront.dispatch(request);
          expect(match).toHaveProperty('isoCountry', 'DK');
        });

        it('should report expected region code', async () => {
          const [match] = await cloudfront.dispatch(request);
          expect(match).toHaveProperty('isoRegion', 'DK-84');
        });

        it('should report expected continent', async () => {
          const [match] = await cloudfront.dispatch(request);
          expect(match).toHaveProperty('continent', 'EU');
        });

        it('should contain POP in the reported results', async () => {
          const [match] = await cloudfront.dispatch(request);
          expect(match).toHaveProperty('extra.pop', 'CPH');
        });
      });
    });

    describe('with a POP pointing to partial or missing data', () => {
      let request: Request;
      let spy: jest.SpyInstance;

      beforeEach(() => {
        request = new Request({
          responseHeaders: [{ name: 'X-Amz-Cf-Pop', value: 'EKNM' }],
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
        const [match] = await cloudfront.dispatch(request);
        expect(match).toHaveProperty('isoCountry', 'EU');
      });

      it('should report expected region code', async () => {
        const [match] = await cloudfront.dispatch(request);
        expect(match).toHaveProperty('isoRegion', 'DK');
      });

      it('should report expected continent', async () => {
        const [match] = await cloudfront.dispatch(request);
        expect(match.continent).toBeNull();
      });

      it('should contain POP in the reported results', async () => {
        const [match] = await cloudfront.dispatch(request);
        expect(match).toHaveProperty('extra.pop', 'EKNM');
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
            name: 'X-Amz-Cf-Pop',
            value: 'CPH50-C1',
          },
        ],
      });
      const ignored = await cloudfront.dispatch(request);

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
            name: 'X-Amz-Cf-Pop',
            value: 'Cph50-C1',
          },
        ],
      });
      const ignored = await cloudfront.dispatch(request);

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
            name: 'X-Amz-Cf-Pop',
            value: 'XXX50-C1',
          },
        ],
      });
      const ignored = await cloudfront.dispatch(request);

      expect(spy).toHaveBeenCalledWith(expect.any(Object), 'XXX');
      expect(spy).toHaveReturnedWith(null);
    });
  });

  describe('when scoring', () => {
    describe('when the Via header contains reference to cloudfront.net', () => {
      it('should give the top score', async () => {
        const request = new Request({
          responseHeaders: [
            {
              name: 'via',
              value:
                '1.1 3322228822885568614ba932732916eb.cloudfront.net (CloudFront)',
            },
            {
              name: 'X-Amz-Cf-Pop',
              value: 'CPH50-C1',
            },
          ],
        });

        const [match] = await cloudfront.dispatch(request);
        expect(match.score).toBeCloseTo(1.0);
      });

      it('should ignore letter case', async () => {
        const request = new Request({
          responseHeaders: [
            {
              name: 'via',
              value:
                '1.1 3322228822885568614ba932732916eb.ClOuDFrONt.net (CloudFront)',
            },
            {
              name: 'X-Amz-Cf-Pop',
              value: 'CPH50-C1',
            },
          ],
        });

        const [match] = await cloudfront.dispatch(request);
        expect(match.score).toBeCloseTo(1.0);
      });
    });

    describe('when the Via header is absent', () => {
      it('should score lower', async () => {
        const request = new Request({
          responseHeaders: [{ name: 'X-Amz-Cf-Pop', value: 'CPH50-C1' }],
        });

        const [match] = await cloudfront.dispatch(request);
        expect(match.score).toBeCloseTo(0.75);
      });
    });

    describe('when the Via header does not mention CloudFront', () => {
      it('should score lower', async () => {
        const request = new Request({
          responseHeaders: [
            { name: 'via', value: '1.1 vegur' },
            { name: 'X-Amz-Cf-Pop', value: 'CPH50-C1' },
          ],
        });

        const [match] = await cloudfront.dispatch(request);
        expect(match.score).toBeCloseTo(0.75);
      });
    });
  });

  describe('when analyzing Cache Status', () => {
    describe('if present', () => {
      it('should report it back', async () => {
        const request = new Request({
          responseHeaders: [
            { name: 'X-Cache', value: 'Miss from cloudfront' },
            { name: 'X-Amz-Cf-Pop', value: 'CPH50-C1' },
          ],
        });

        const [match] = await cloudfront.dispatch(request);
        expect(match).toHaveProperty(
          'extra.cacheStatus',
          'Miss from cloudfront'
        );
      });
    });

    describe('if empty', () => {
      it('should not report it back', async () => {
        const request = new Request({
          responseHeaders: [
            { name: 'X-Cache', value: '' },
            { name: 'X-Amz-Cf-Pop', value: 'CPH50-C1' },
          ],
        });

        const [match] = await cloudfront.dispatch(request);
        expect(match.extra.cacheStatus).toBeNull();
      });
    });
  });
});
