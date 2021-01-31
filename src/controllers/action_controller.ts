import { ReportEmptyCommand } from '../commands/report_empty';
import { ReportReadyCommand } from '../commands/report_ready';
import * as mediator from '../util/mediator';

mediator.subscribe(ReportEmptyCommand, async function ({ tabId }, defaultIcon) {
  await browser.pageAction.setPopup({ tabId, popup: 'popup.html' });

  await browser.pageAction.setIcon({ tabId, imageData: defaultIcon });

  await browser.pageAction.show(tabId);
});

mediator.subscribe(
  ReportReadyCommand,
  async function ({ tabId, report }, icons) {
    await browser.pageAction.setPopup({
      tabId,
      popup: 'popup.html?tab=' + tabId,
    });
    await browser.pageAction.show(tabId);

    if (!report.isEmpty) {
      // FIXME: implement localhost detection

      await browser.pageAction.setIcon({ tabId, imageData: icons });

      const title =
        report.countryName + '\n- ' + browser.i18n.getMessage('ext_name');
      browser.pageAction.setTitle({ tabId, title });
    }
  }
);
