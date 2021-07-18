import { WebRequest } from 'webextension-polyfill-ts';

import { BootCommand } from '../commands/boot';
import { ReportReadyCommand } from '../commands/report_ready';
import * as reportService from '../services/report/report_service';
import * as debug from '../util/debug';
import * as mediator from '../util/mediator';

mediator.subscribe(BootCommand, function () {
  browser.webRequest.onResponseStarted.addListener(
    module.hot
      ? (res) => {
          void handleWebResponseStarted(res);
        }
      : handleWebResponseStarted,
    {
      urls: ['<all_urls>'],
      types: ['main_frame'],
    },
    ['responseHeaders']
  );
});

async function handleWebResponseStarted(
  payload: WebRequest.OnResponseStartedDetailsType
) {
  const { tabId } = payload;

  if (tabId === browser.tabs.TAB_ID_NONE) {
    return; // skip extension popups
  }

  debug.log(`Tab#${tabId}: Collecting new report`, payload);
  const report = await reportService.collect(payload);

  await mediator.publish(new ReportReadyCommand(tabId, report));
}
