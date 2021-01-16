import * as interceptors from '../interceptors';
import * as harness from '../interceptors/__harness__';

import { CountryReplyCommand } from './country_reply';

describe('Country Reply Command', () => {
  let command: CountryReplyCommand;

  beforeEach(() => {
    command = new CountryReplyCommand(NaN, {});
  });

  describe('when executing', () => {
    it('should pass the request through all heuristics', async () => {
      const spies = interceptors.heuristics.map((heuristic) =>
        jest.spyOn(heuristic, 'dispatch')
      );

      const ignored = await command.execute();

      for (const mock of interceptors.heuristics) {
        expect(mock.dispatch).toHaveBeenCalledWith(command.request);
      }
      expect(interceptors.heuristics).toHaveLength(2);

      for (const spy of spies) {
        spy.mockRestore();
      }
    });

    describe('with some heuristics scoring zero', () => {
      harness.heuristics.mock([
        [{ score: 0.0 }],
        [{ score: 0.5 }],
        [{ score: 0.000001 }],
        [{ score: 0.0 }],
      ]);

      it('should return only matches scoring higher than zero', () =>
        expect(command.execute()).resolves.toStrictEqual([
          { score: 0.5 },
          { score: 0.000001 },
        ]));
    });

    describe('with some heuristics returning more than 1 match', () => {
      harness.heuristics.mock([
        [{ score: 0.0 }, { score: 0.000001 }],
        [{ score: 0.005 }, { score: 0.0 }],
        [{ score: 0.006 }, { score: 0.004 }],
      ]);

      it('should provide a flat list of matches', () =>
        expect(command.execute()).resolves.toStrictEqual([
          { score: 0.006 },
          { score: 0.005 },
          { score: 0.004 },
          { score: 0.000001 },
        ]));
    });

    describe('with unsorted matches', () => {
      harness.heuristics.mock([
        [{ score: 0.5 }],
        [{ score: 0.4 }],
        [{ score: 0.6 }],
        [{ score: 0.7 }],
      ]);

      it('should rank the matches by score in descending order', () =>
        expect(command.execute()).resolves.toStrictEqual([
          { score: 0.7 },
          { score: 0.6 },
          { score: 0.5 },
          { score: 0.4 },
        ]));
    });
  });
});
