import type { PageAction } from 'webextension-polyfill';

import type { IconData, Path } from './index.ts';

export /* @inline */ function setIcon(tabId: number, icon: Path | IconData) {
  return browser.pageAction!.setIcon({
    tabId,
    path: (icon as Path).path,
    imageData: (icon as IconData).imageData as PageAction.ImageDataType,
  });
}
