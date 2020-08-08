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

  describe('when resolving request', () => {
    const heuristicsModule = require('./heuristics');
    let originalHeuristics: Function[];
    let request: CountryRequest;

    beforeEach(() => {
      originalHeuristics = heuristicsModule.heuristics;
      request = new CountryRequest({});
    });

    afterEach(() => {
      heuristicsModule.heuristics = originalHeuristics;
    });

    it('should pass itself to all heuristics', async () => {
      for (const heuristic of heuristicsModule.heuristics) {
        jest.spyOn(heuristic, 'resolve');
      }

      const ignored = await request.resolve();

      expect(heuristicsModule.heuristics).toHaveLength(2);
      for (const mock of heuristicsModule.heuristics) {
        expect(mock.resolve).toHaveBeenCalledWith(request);
      }

      for (const mock of heuristicsModule.heuristics) {
        mock.resolve.mockRestore();
      }
    });

    it('should return only matches scoring higher than 0', async () => {
      heuristicsModule.heuristics = [
        { resolve: jest.fn().mockReturnValue([{ score: 0.0 }]) },
        { resolve: jest.fn().mockReturnValue([{ score: 0.5 }]) },
        { resolve: jest.fn().mockReturnValue([{ score: 0.000001 }]) },
        { resolve: jest.fn().mockReturnValue([{ score: 0.0 }]) },
      ];

      await expect(request.resolve()).resolves.toStrictEqual([
        { score: 0.5 },
        { score: 0.000001 },
      ]);
    });

    it('should should support more than 1 match per heuristic', async () => {
      heuristicsModule.heuristics = [
        {
          resolve: jest
            .fn()
            .mockReturnValue([{ score: 0.0 }, { score: 0.000001 }]),
        },
        {
          resolve: jest
            .fn()
            .mockReturnValue([{ score: 0.005 }, { score: 0.0 }]),
        },
      ];

      await expect(request.resolve()).resolves.toStrictEqual([
        { score: 0.005 },
        { score: 0.000001 },
      ]);
    });

    it('should sort matches by ranking score in descending order', async () => {
      heuristicsModule.heuristics = [
        { resolve: jest.fn().mockReturnValue([{ score: 0.5 }]) },
        { resolve: jest.fn().mockReturnValue([{ score: 0.4 }]) },
        { resolve: jest.fn().mockReturnValue([{ score: 0.6 }]) },
        { resolve: jest.fn().mockReturnValue([{ score: 0.7 }]) },
      ];

      await expect(request.resolve()).resolves.toStrictEqual([
        { score: 0.7 },
        { score: 0.6 },
        { score: 0.5 },
        { score: 0.4 },
      ]);
    });
  });
});
