import { setIcon as setBrowserIcon } from './-chromium.ts';
import { setIcon as setPageIcon } from './-moz.ts';

export interface Path {
  path: string | Record<string, string>;
}

export interface IconData {
  imageData: ImageData | Record<string, ImageData>;
}

export /* @inline */ function setIcon(tabId: number, icon: Path | IconData) {
  return typeof browser.pageAction !== 'undefined'
    ? setPageIcon(tabId, icon)
    : setBrowserIcon(tabId, icon);
}
