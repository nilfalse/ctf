/// <reference types="chrome-types" />
import type Moz from 'webextension-polyfill';

declare global {
  const browser: typeof chrome & Partial<Pick<Moz.Browser, 'pageAction'>>;
}

export {};
