export /* @inline */ function getURL(resource: string) {
  return browser.runtime.getURL(resource);
}

export /* @inline */ function getPlatform() {
  return browser.runtime.getPlatformInfo();
}
