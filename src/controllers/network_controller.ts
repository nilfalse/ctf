import { BootCommand } from '../commands/boot';
import { ReportReadyCommand } from '../commands/report_ready';
import { RequestParameters } from '../lib/request';
import * as mediator from '../util/mediator';

mediator.subscribe(BootCommand, function () {
  chrome.webRequest.onCompleted.addListener(
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

interface WebRequestPayload extends RequestParameters {
  tabId: number;
}

function handleWebRequestCompleted(payload: WebRequestPayload) {
  const { tabId } = payload;

  if (tabId === -1) {
    return; // skip extension popups
  }

  mediator.publish(new ReportReadyCommand(tabId, payload));
}
