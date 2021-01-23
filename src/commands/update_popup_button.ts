import { Report } from '../lib/report';
import { error } from '../util/debug';

function reportErrorIfAny() {
  if (chrome.runtime.lastError) {
    error(chrome.runtime.lastError);
  }
}

export class UpdatePopupButtonCommand {
  constructor(public tabId: number, public report: Report) {}

  async execute() {
    const { tabId } = this;

    chrome.pageAction.setPopup(
      { tabId, popup: 'popup.html?tab=' + tabId },
      reportErrorIfAny
    );
    chrome.pageAction.show(tabId, reportErrorIfAny);

    if (!this.report.isEmpty) {
      // FIXME: implement localhost detection

      chrome.pageAction.setIcon(
        { tabId, imageData: await this.report.icons },
        reportErrorIfAny
      );

      chrome.pageAction.setTitle(
        {
          tabId,
          title: this.report.name + '\n- ' + chrome.i18n.getMessage('ext_name'),
        },
        reportErrorIfAny
      );
    }
  }
}
