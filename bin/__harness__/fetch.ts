import { Readable } from 'stream';

import fetch from 'node-fetch';

jest.mock('node-fetch');

const { Response } = jest.requireActual('node-fetch');

export function stream(content: string) {
  const fetchMock = fetch.default as jest.Mock<typeof fetch.default>;

  beforeEach(() => {
    const body = Readable.from([Buffer.from(content)]);
    const response = new Response(body);

    fetchMock.mockReturnValue(Promise.resolve(response));
  });

  afterEach(() => fetchMock.mockReset());

  afterAll(() => fetchMock.mockRestore());

  return fetchMock;
}
