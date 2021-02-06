import { Request } from '../lib/request';
import * as geo from '../services/geo/geo_service';

import * as ip from './ip';

jest.mock('../services/geo/geo_service');

describe('IP interceptor', () => {
  beforeAll(geo.init);

  describe('when dispatching a request', () => {
    describe('without ip field', () => {
      it('should not report any matches', () =>
        expect(ip.dispatch(new Request({}))).resolves.toHaveLength(0));
    });

    describe('with an ip of unrecognized country', () => {
      it('should not report any matches', () =>
        expect(
          // Cloudflare dashboard IP address
          ip.dispatch(new Request({ ip: '198.41.200.100' }))
        ).resolves.toHaveLength(0));
    });

    describe('with a Danish ip', () => {
      it('should match Denmark', () =>
        expect(
          ip.dispatch(new Request({ ip: '2.110.30.100' }))
        ).resolves.toMatchObject([
          {
            heuristic: 'ip',
            isoCountry: 'DK',
            extra: {
              registeredCountry: 'DK',
            },
          },
        ]));
    });
  });
});
