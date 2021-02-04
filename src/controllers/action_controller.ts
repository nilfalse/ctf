import { ReportEmptyCommand } from '../commands/report_empty';
import { ReportReadyCommand } from '../commands/report_ready';
import * as mediator from '../util/mediator';

mediator.subscribe(ReportEmptyCommand, async function ({ tabId }, defaultIcon) {
  await Promise.all([
    browser.pageAction.setPopup({ tabId, popup: 'popup.html' }),
    browser.pageAction.setIcon({ tabId, ...defaultIcon }),
    browser.pageAction.show(tabId),
  ]);
});

mediator.subscribe(
  ReportReadyCommand,
  async function ({ tabId, report }, icon) {
    const promises = [
      browser.pageAction.setPopup({ tabId, popup: 'popup.html?tab=' + tabId }),
      browser.pageAction.show(tabId),
    ];

    if (!report.isEmpty) {
      // FIXME: implement localhost detection

      promises.push(browser.pageAction.setIcon({ tabId, ...icon }));

      const title = `${browser.i18n.getMessage('ext_name')}:
${report.countryName}
`;
      browser.pageAction.setTitle({ tabId, title });
    }

    await Promise.all(promises);
  }
);
