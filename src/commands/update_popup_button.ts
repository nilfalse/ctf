import { error } from '../debug';
import { Match } from '../interceptors';
import { fromISOCountryCode } from '../lib/emoji';
import { render } from '../rendering';

function reportErrorIfAny() {
  if (chrome.runtime.lastError) {
    error(chrome.runtime.lastError);
  }
}

export class UpdatePopupButtonCommand {
  constructor(public tabId: number, public matches: ReadonlyArray<Match>) {}

  async execute() {
    const { tabId } = this;

    for (const match of this.matches) {
      const flag = await fromISOCountryCode(match.isoCountry);
      const countryName = chrome.i18n.getMessage(
        'country_name_' + match.isoCountry
      );

      if (flag) {
        chrome.pageAction.setIcon(
          { tabId, imageData: await render(flag.emoji) },
          reportErrorIfAny
        );

        if (countryName) {
          chrome.pageAction.setTitle(
            {
              tabId,
              title: countryName + '\n- ' + chrome.i18n.getMessage('ext_name'),
            },
            reportErrorIfAny
          );
        }
        chrome.pageAction.setPopup(
          { tabId, popup: 'popup.html?tab=' + tabId },
          reportErrorIfAny
        );
        chrome.pageAction.show(tabId, reportErrorIfAny);

        return;
      }
    }

    // empty state fallback
    // FIXME: implement localhost detection
    chrome.pageAction.setPopup(
      { tabId, popup: 'popup.html?tab=' + tabId },
      reportErrorIfAny
    );
    chrome.pageAction.show(tabId, reportErrorIfAny);
  }
}
