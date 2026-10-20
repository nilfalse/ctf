export interface Payload {
  tabId: number;
  url: string;
  responseHeaders?: Header[];
  ip?: string;
}

export interface Header {
  name: string;
  value?: string;
}

export function listen(cb: (payload: Payload) => unknown) {
  function handleResponseStarted(payload: Payload) {
    if (payload.tabId === browser.tabs.TAB_ID_NONE) {
      return; // skip extension popups
    }

    cb(payload);
  }

  return browser.webRequest.onResponseStarted.addListener(
    handleResponseStarted,
    { urls: ['<all_urls>'], types: ['main_frame'] },
    ['responseHeaders'],
  );
}
