import { Browser } from 'webextension-polyfill-ts';

declare interface MockedBrowser extends Browser {
  ctfHarness?: boolean;
}

declare global {
  const browser: MockedBrowser;

  const InstallTrigger: unknown;
}
