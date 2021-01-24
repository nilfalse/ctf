import { InitCommand } from '../commands/init';
import { ReportReadyCommand } from '../commands/report_ready';
import { CountryRequestParams } from '../lib/country_request';
import * as mediator from '../util/mediator';

mediator.subscribe(InitCommand, function () {
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

interface WebRequestPayload extends CountryRequestParams {
  tabId: number;
}

function handleWebRequestCompleted(payload: WebRequestPayload) {
  const { tabId } = payload;

  if (tabId === -1) {
    return; // skip extension popups
  }

  mediator.publish(new ReportReadyCommand(tabId, payload));
}
