import { Match } from '../_common';
import { rewire$heuristics, restore } from '../heuristics';

export function mock(results: ReadonlyArray<ReadonlyArray<Partial<Match>>>) {
  beforeEach(() =>
    rewire$heuristics(
      results.map((retVal) => ({
        dispatch: jest.fn().mockResolvedValue(retVal),
      }))
    )
  );

  afterEach(restore);
}
