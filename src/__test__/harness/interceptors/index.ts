import { Match } from '../../../interceptors/_common';
import { rewire$heuristics, restore } from '../../../interceptors/heuristics';

export function heuristics(
  results: ReadonlyArray<ReadonlyArray<Partial<Match>>>
) {
  beforeEach(() =>
    rewire$heuristics(
      results.map((retVal) => ({
        dispatch: jest.fn().mockResolvedValue(retVal),
      }))
    )
  );

  afterEach(restore);
}
