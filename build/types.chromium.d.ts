/// <reference types="chrome-types" />
import type { PageAction } from 'webextension-polyfill';

declare global {
  namespace browser {
    const pageAction: PageAction | undefined;
  }
}

export {};
