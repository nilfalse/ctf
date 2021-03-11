import * as dnsService from '../services/dns/dns_service';

import { Request } from './request';

describe('Request', () => {
  describe('when no IP address is present', () => {
    it('should return null for ip', () => {
      expect(new Request({}).ip).toBeNull();
    });
  });

  describe('when no URL address is present', () => {
    it('should return null for url', () => {
      expect(new Request({}).url).toBeNull();
    });
  });

  describe('when getting a header', () => {
    describe('if no headers were provided initially', () => {
      it('should return empty string', () => {
        const request = new Request({});

        expect(request.getHeader('Content-Disposition')).toBe('');
      });
    });

    describe('if header does not exist', () => {
      it('should return empty string', () => {
        const request = new Request({
          responseHeaders: [],
        });

        expect(request.getHeader('Content-Disposition')).toBe('');
      });
    });

    describe(`if header's value was not defined`, () => {
      it('should return empty string', () => {
        const request = new Request({
          responseHeaders: [{ name: 'Content-Disposition' }],
        });

        expect(request.getHeader('Content-Disposition')).toBe('');
      });
    });
  });

  describe('when getting existing proper header', () => {
    const headerValue = 'attachment; filename="filename.jpg"';
    let request: Request;

    beforeEach(() => {
      request = new Request({
        responseHeaders: [{ name: 'Content-Disposition', value: headerValue }],
      });
    });

    describe('by the same name', () => {
      it('should return the same value', () => {
        expect(request.getHeader('Content-Disposition')).toBe(headerValue);
      });
    });

    describe('by upper case name', () => {
      it('should return the same value', () => {
        expect(request.getHeader('CONTENT-DISPOSITION')).toBe(headerValue);
      });
    });

    describe('by lower case name', () => {
      it('should return the same value', () => {
        expect(request.getHeader('content-disposition')).toBe(headerValue);
      });
    });
  });

  describe('when instantiating from a Web Request', () => {
    describe('with missing IP (Firefox-only)', () => {
      it('should try to restore it using DNS service', async () => {
        const dnsSpy = jest
          .spyOn(dnsService, 'offline')
          .mockResolvedValue([
            '195.64.225.67',
            '2a02:2540:1000:300:a11:2718:0:1',
          ]);
        const request = await Request.fromWebRequest({
          url: 'https://www.ix.net.ua/en',
        });

        expect(dnsSpy).toHaveBeenCalledWith('ix.net.ua');
        expect(request).toHaveProperty('ip', '195.64.225.67');
        expect(dnsSpy).toHaveBeenCalledTimes(1);

        dnsSpy.mockRestore();
      });
    });
  });
});
