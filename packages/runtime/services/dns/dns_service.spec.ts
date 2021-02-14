import * as harness from '../../__test__/harness';

import * as dnsService from './dns_service';

jest.mock('../env/env_service', () => ({
  supportsResolveDNS: true,
}));

describe('DNS service', () => {
  describe('offline()', () => {
    harness.browser.dns({ addresses: ['1.1.1.1'] });

    it('should resolve hostname with proper addresses', () =>
      expect(dnsService.offline('ilin.dk')).resolves.toMatchObject([
        '1.1.1.1',
      ]));

    it('should resolve hostname using offline DNS', async () => {
      await dnsService.offline('ilin.dk');

      expect(browser.dns.resolve).toHaveBeenCalledWith('ilin.dk', ['offline']);
    });
  });
});
