import {
  setIcon as setBrowserIcon,
  setPopup as setBrowserPopup,
} from './-chromium.ts';
import { setIcon as setPageIcon, setPopup as setPagePopup } from './-moz.ts';

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

export /* @inline */ function setPopup(tabId: number, popup: string) {
  return typeof browser.pageAction !== 'undefined'
    ? setPagePopup(tabId, popup)
    : setBrowserPopup(tabId, popup);
}
