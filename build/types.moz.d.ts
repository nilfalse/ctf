/// <reference types="chrome-types/no-browser" />
import type { Browser } from 'webextension-polyfill';

declare global {
  const browser: Browser;
}
