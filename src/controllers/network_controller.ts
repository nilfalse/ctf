import { WebRequest } from 'webextension-polyfill-ts';

import { BootCommand } from '../commands/boot';
import { ReportReadyCommand } from '../commands/report_ready';
import * as mediator from '../util/mediator';

mediator.subscribe(BootCommand, function () {
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
});

function handleWebRequestCompleted(payload: WebRequest.OnCompletedDetailsType) {
  const { tabId } = payload;

  if (tabId === -1) {
    return; // skip extension popups
  }

  return mediator.publish(new ReportReadyCommand(tabId, payload));
}
