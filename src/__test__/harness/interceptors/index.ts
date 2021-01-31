import { Match } from '../../../interceptors/_common';

export function heuristics(
  results: ReadonlyArray<ReadonlyArray<Partial<Match>>>
) {
  const {
    rewire$heuristics,
    restore,
    // eslint-disable-next-line @typescript-eslint/no-var-requires
  } = require('../../../interceptors/heuristics');

  beforeEach(() =>
    rewire$heuristics(
      results.map((retVal) => ({
        dispatch: jest.fn().mockResolvedValue(retVal),
      }))
    )
  );

  afterEach(restore);
}
