import { CountryRequest } from '../lib/country_request';

import * as ip from './ip';

jest.mock('../lib/geo');

describe('IP interceptor', () => {
  describe('when dispatching a request', () => {
    describe('without ip field', () => {
      it('should not report any matches', () =>
        expect(ip.dispatch(new CountryRequest({}))).resolves.toHaveLength(0));
    });

    describe('with an ip of unrecognized country', () => {
      it('should not report any matches', () =>
        expect(
          // Cloudflare dashboard IP address
          ip.dispatch(new CountryRequest({ ip: '198.41.200.100' }))
        ).resolves.toHaveLength(0));
    });

    describe('with a Danish ip', () => {
      it('should match Denmark', () =>
        expect(
          ip.dispatch(new CountryRequest({ ip: '2.110.30.100' }))
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
