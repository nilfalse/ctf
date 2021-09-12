import * as harness from '../__test__/harness';
import { Request } from '../lib/request';

import * as interceptors from '.';

describe('Interceptors', () => {
  let request: Request;

  beforeEach(() => {
    request = new Request({});
  });

  it('should pass the request through all heuristics', async () => {
    const spies = interceptors.heuristics.map((heuristic) =>
      jest.spyOn(heuristic, 'dispatch')
    );

    const ignored = await interceptors.run(request);

    for (const mock of interceptors.heuristics) {
      expect(mock.dispatch).toHaveBeenCalledWith(request);
    }
    expect(interceptors.heuristics).toHaveLength(4);

    for (const spy of spies) {
      spy.mockRestore();
    }
  });

  describe('with some heuristics scoring zero', () => {
    harness.interceptors.heuristics([
      [{ score: 0.0 }],
      [{ score: 0.5 }],
      [{ score: 0.000001 }],
      [{ score: 0.0 }],
    ]);

    it('should return only matches scoring higher than zero', () =>
      expect(interceptors.run(request)).resolves.toStrictEqual([
        { score: 0.5 },
        { score: 0.000001 },
      ]));
  });

  describe('with some heuristics returning more than 1 match', () => {
    harness.interceptors.heuristics([
      [{ score: 0.0 }, { score: 0.000001 }],
      [{ score: 0.005 }, { score: 0.0 }],
      [{ score: 0.006 }, { score: 0.004 }],
    ]);

    it('should provide a flat list of matches', () =>
      expect(interceptors.run(request)).resolves.toStrictEqual([
        { score: 0.006 },
        { score: 0.005 },
        { score: 0.004 },
        { score: 0.000001 },
      ]));
  });

  describe('with unsorted matches', () => {
    harness.interceptors.heuristics([
      [{ score: 0.5 }],
      [{ score: 0.4 }],
      [{ score: 0.6 }],
      [{ score: 0.7 }],
    ]);

    it('should rank the matches by score in descending order', () =>
      expect(interceptors.run(request)).resolves.toStrictEqual([
        { score: 0.7 },
        { score: 0.6 },
        { score: 0.5 },
        { score: 0.4 },
      ]));
  });
});
