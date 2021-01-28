import { Readable } from 'stream';

export function stream(content: string) {
  const ref = {
    mock: null,
    response: null,
  };

  beforeEach(() => {
    const fetch = jest.requireActual('node-fetch');

    const body = Readable.from([Buffer.from(content)]);
    ref.response = new fetch.Response(body);

    ref.mock = jest.spyOn(fetch, 'default').mockResolvedValue(ref.response);
  });

  afterEach(() => ref.mock.mockReset());

  afterAll(() => ref.mock.mockRestore());

  return ref;
}
