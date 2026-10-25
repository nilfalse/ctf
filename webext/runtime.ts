export /* @inline */ function getURL(resource: string) {
  return browser.runtime.getURL(resource);
}

export /* @inline */ function onInstalled(cb: () => unknown) {
  return browser.runtime.onInstalled.addListener(cb);
}

export /* @inline */ function getPlatform() {
  return browser.runtime.getPlatformInfo();
}
