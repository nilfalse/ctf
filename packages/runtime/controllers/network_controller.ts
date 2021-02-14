import { WebRequest } from 'webextension-polyfill-ts';

import { BootCommand } from '../commands/boot';
import { ReportReadyCommand } from '../commands/report_ready';
import * as mediator from '../util/mediator';

mediator.subscribe(BootCommand, function () {
  browser.webRequest.onResponseStarted.addListener(
    module.hot
      ? (res) => handleWebResponseStarted(res)
      : handleWebResponseStarted,
    {
      urls: ['<all_urls>'],
      types: ['main_frame'],
    },
    ['responseHeaders']
  );
});

function handleWebResponseStarted(
  payload: WebRequest.OnResponseStartedDetailsType
) {
  const { tabId } = payload;

  if (tabId === browser.tabs.TAB_ID_NONE) {
    return; // skip extension popups
  }

  return mediator.publish(new ReportReadyCommand(tabId, payload));
}
