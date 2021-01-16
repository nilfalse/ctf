import { Readable } from 'stream';

import * as fetch from 'node-fetch';

export function stream(content: string) {
  const ref = {
    mock: null,
  };

  beforeEach(() => {
    const body = Readable.from([Buffer.from(content)]);
    const response = new fetch.Response(body);

    ref.mock = jest.spyOn(fetch, 'default').mockResolvedValue(response);
  });

  afterEach(() => ref.mock.mockReset());

  afterAll(() => ref.mock.mockRestore());

  return ref;
}
