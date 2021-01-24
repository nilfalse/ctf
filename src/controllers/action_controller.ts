import { ReportEmptyCommand } from '../commands/report_empty';
import { ReportReadyCommand } from '../commands/report_ready';
import * as debug from '../util/debug';
import * as mediator from '../util/mediator';

mediator.subscribe(ReportEmptyCommand, function ({ tabId }, defaultIcon) {
  chrome.pageAction.setPopup({ tabId, popup: 'popup.html' }, catchErr);

  chrome.pageAction.setIcon({ tabId, imageData: defaultIcon }, catchErr);

  chrome.pageAction.show(tabId, catchErr);
});

mediator.subscribe(ReportReadyCommand, function ({ tabId, report }, icons) {
  chrome.pageAction.setPopup(
    { tabId, popup: 'popup.html?tab=' + tabId },
    catchErr
  );
  chrome.pageAction.show(tabId, catchErr);

  if (!report.isEmpty) {
    // FIXME: implement localhost detection

    chrome.pageAction.setIcon({ tabId, imageData: icons }, catchErr);

    const title = report.name + '\n- ' + chrome.i18n.getMessage('ext_name');
    chrome.pageAction.setTitle({ tabId, title }, catchErr);
  }
});

function catchErr() {
  if (chrome.runtime.lastError) {
    debug.error(chrome.runtime.lastError);
  }
}
