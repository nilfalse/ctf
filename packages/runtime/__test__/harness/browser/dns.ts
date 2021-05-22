import { Dns } from 'webextension-polyfill-ts';

import { stub } from './stub';

interface DnsMock {
  addresses: string[];
}

export function dns(mock: DnsMock) {
  const browser = stub();

  beforeEach(() => {
    browser.dns = {
      resolve: jest.fn().mockResolvedValue(mock),
    };
  });

  afterEach(() => {
    browser.dns = undefined as unknown as Dns.Static;
  });
}
