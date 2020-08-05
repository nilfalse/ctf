import { CountryRequest } from './country_request';

describe('Country Request', () => {
  describe('when no IP address is present', () => {
    it('should return null for ip', () => {
      expect(new CountryRequest({}).ip).toBeNull();
    });
  });

  describe('when no URL address is present', () => {
    it('should return null for url', () => {
      expect(new CountryRequest({}).url).toBeNull();
    });
  });

  describe('when getting a header', () => {
    describe('if no headers were provided initially', () => {
      it('should return empty string', () => {
        const request = new CountryRequest({});

        expect(request.getHeader('User-Agent')).toBe('');
      });
    });

    describe('if header does not exist', () => {
      it('should return empty string', () => {
        const request = new CountryRequest({
          responseHeaders: [],
        });

        expect(request.getHeader('User-Agent')).toBe('');
      });
    });

    describe(`if header's value was not defined`, () => {
      it('should return empty string', () => {
        const request = new CountryRequest({
          responseHeaders: [{ name: 'User-Agent' }],
        });

        expect(request.getHeader('User-Agent')).toBe('');
      });
    });
  });

  describe('when getting existing proper header', () => {
    const headerValue =
      'User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:12.0) Gecko/20100101 Firefox/12.0';
    let request: CountryRequest;

    beforeEach(() => {
      request = new CountryRequest({
        responseHeaders: [{ name: 'User-Agent', value: headerValue }],
      });
    });

    describe('by the same name', () => {
      it('should return the same value', () => {
        expect(request.getHeader('User-Agent')).toBe(headerValue);
      });
    });

    describe('by upper case name', () => {
      it('should return the same value', () => {
        expect(request.getHeader('USER-AGENT')).toBe(headerValue);
      });
    });

    describe('by lower case name', () => {
      it('should return the same value', () => {
        expect(request.getHeader('user-agent')).toBe(headerValue);
      });
    });
  });
});
