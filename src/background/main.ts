import { handleWebRequestCompleted } from './handler';

interface StartParams {
  browser: typeof chrome;
}

export function start({ browser }: StartParams) {
  browser.webRequest.onCompleted.addListener(
    module.hot
      ? (res) => handleWebRequestCompleted(res)
      : handleWebRequestCompleted,
    {
      urls: ['<all_urls>'],
      types: ['main_frame'],
    },
    ['responseHeaders']
  );
}

if (module.hot) {
  module.hot.accept('./handler');
}
