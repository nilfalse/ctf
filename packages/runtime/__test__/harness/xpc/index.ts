import { Runtime } from 'webextension-polyfill-ts';

import { Match } from '../../../interceptors';
import { RequestParameters } from '../../../lib/request';
import { stub } from '../browser/stub';

interface MockXPC {
  request?: RequestParameters;
  traceroute: ReadonlyArray<Match>;
}

export function popup(
  contentPromise: Promise<MockXPC | null>,
  searchParamsStr = '?tab=123'
) {
  const { location } = globalThis;

  const browser = stub();

  beforeEach(() => {
    browser.runtime.sendMessage = jest.fn().mockReturnValue(contentPromise);

    delete (globalThis as Partial<typeof globalThis>).location;
    globalThis.location = {
      search: searchParamsStr,
    } as unknown as Location;
  });

  afterEach(() => {
    globalThis.location = location;

    delete (browser.runtime as Partial<Runtime.Static>).sendMessage;
  });
}
