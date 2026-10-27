import type { Action } from 'webextension-polyfill';

import type { IconData, Path } from './index.ts';

export /* @inline */ function setIcon(tabId: number, icon: Path | IconData) {
  return browser.action.setIcon({
    tabId,
    path: (icon as Path).path,
    imageData: (icon as IconData).imageData as Action.ImageDataType,
  });
}

export /* @inline */ function setTitle(tabId: number, title: string) {
  return browser.action.setTitle({ tabId, title });
}

export /* @inline */ function setPopup(tabId: number, popup: string) {
  return browser.action.setPopup({ tabId, popup });
}
