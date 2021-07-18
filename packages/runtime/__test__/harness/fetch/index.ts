import { Readable } from 'stream';

export function stream(content: string) {
  const ref = {
    mock: null as unknown as jest.SpyInstance<
      Promise<import('node-fetch').Response>
    >,
    response: null as unknown as import('node-fetch').Response,
  };

  beforeEach(() => {
    const fetch = jest.requireActual<typeof import('node-fetch')>('node-fetch');

    const body = Readable.from([Buffer.from(content)]);
    ref.response = new fetch.Response(body);

    ref.mock = jest.spyOn(fetch, 'default').mockResolvedValue(ref.response);
  });

  afterEach(() => ref.mock.mockReset());

  afterAll(() => ref.mock.mockRestore());

  return ref;
}
