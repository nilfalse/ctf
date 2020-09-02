import { Match } from '../heuristics';
import { CountryRequest } from '../lib/country_request';

import { CountryResponseCommand } from './country_response';

describe('Country Response Command', () => {
  describe('when executing', () => {
    const heuristicsModule = require('../heuristics');
    let originalHeuristics: ReadonlyArray<(
      req: CountryRequest
    ) => ReadonlyArray<Match>>;
    let command: CountryResponseCommand;

    beforeEach(() => {
      originalHeuristics = heuristicsModule.heuristics;
      command = new CountryResponseCommand(1, {});
    });

    afterEach(() => {
      heuristicsModule.heuristics = originalHeuristics;
    });

    it('should pass the request to all heuristics', async () => {
      for (const heuristic of heuristicsModule.heuristics) {
        jest.spyOn(heuristic, 'dispatch');
      }

      const ignored = await command.execute();

      for (const mock of heuristicsModule.heuristics) {
        expect(mock.dispatch).toHaveBeenCalledWith(command.request);
      }
      expect(heuristicsModule.heuristics).toHaveLength(2);

      for (const mock of heuristicsModule.heuristics) {
        mock.dispatch.mockRestore();
      }
    });

    it('should return only matches scoring higher than 0', () => {
      heuristicsModule.heuristics = [
        { dispatch: jest.fn().mockReturnValue([{ score: 0.0 }]) },
        { dispatch: jest.fn().mockReturnValue([{ score: 0.5 }]) },
        { dispatch: jest.fn().mockReturnValue([{ score: 0.000001 }]) },
        { dispatch: jest.fn().mockReturnValue([{ score: 0.0 }]) },
      ];

      return expect(command.execute()).resolves.toStrictEqual([
        { score: 0.5 },
        { score: 0.000001 },
      ]);
    });

    it('should should support more than 1 match per heuristic', () => {
      heuristicsModule.heuristics = [
        {
          dispatch: jest
            .fn()
            .mockReturnValue([{ score: 0.0 }, { score: 0.000001 }]),
        },
        {
          dispatch: jest
            .fn()
            .mockReturnValue([{ score: 0.005 }, { score: 0.0 }]),
        },
      ];

      return expect(command.execute()).resolves.toStrictEqual([
        { score: 0.005 },
        { score: 0.000001 },
      ]);
    });

    it('should sort matches by the ranking score in descending order', () => {
      heuristicsModule.heuristics = [
        { dispatch: jest.fn().mockReturnValue([{ score: 0.5 }]) },
        { dispatch: jest.fn().mockReturnValue([{ score: 0.4 }]) },
        { dispatch: jest.fn().mockReturnValue([{ score: 0.6 }]) },
        { dispatch: jest.fn().mockReturnValue([{ score: 0.7 }]) },
      ];

      return expect(command.execute()).resolves.toStrictEqual([
        { score: 0.7 },
        { score: 0.6 },
        { score: 0.5 },
        { score: 0.4 },
      ]);
    });
  });
});
