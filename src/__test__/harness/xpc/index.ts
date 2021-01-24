import { Match } from '../../../interceptors';
import { RequestParameters } from '../../../lib/request';
import { stub } from '../browser/stub';
interface MockXPC {
  request?: RequestParameters;
  traceroute: ReadonlyArray<Match>;
}

export function popup(
  contentPromise: Promise<MockXPC>,
  searchParamsStr = '?tab=123'
) {
  const { location } = globalThis;

  const browser = stub();

  beforeEach(async () => {
    const content = await contentPromise;
    browser.runtime.lastError = null;
    browser.runtime.sendMessage = jest
      .fn()
      .mockImplementation((message, callback) => callback(content));

    delete globalThis.location;
    globalThis.location = ({
      search: searchParamsStr,
    } as unknown) as Location;
  });

  afterEach(() => {
    globalThis.location = location;

    delete browser.runtime.lastError;
    delete browser.runtime.sendMessage;
  });
}
