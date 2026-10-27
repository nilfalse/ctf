export /* @inline */ function onInstalled(cb: () => unknown) {
  return browser.runtime.onInstalled.addListener(cb);
}
