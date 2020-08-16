import { error } from '../debug';
import { fromISOCountryCode } from '../lib/emoji';
import { getCountryName } from '../lib/iso';
import { Match } from '../heuristics';
import { render } from '../view/rendering';

export class UpdatePopupButtonCommand {
  tabId: number;
  matches: ReadonlyArray<Match>;

  constructor(tabId: number, matches: ReadonlyArray<Match>) {
    this.tabId = tabId;
    this.matches = matches;
  }

  async execute() {
    const { tabId } = this;

    for (const match of this.matches) {
      const flag = await fromISOCountryCode(match.isoCountry);
      const countryName = await getCountryName(match.isoCountry);

      if (flag) {
        chrome.pageAction.setIcon(
          { tabId, imageData: await render(flag.emoji) },
          reportErrorIfAny
        );

        if (countryName) {
          chrome.pageAction.setTitle(
            { tabId, title: countryName + '\n - Capture The Flag' },
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
  }
}

function reportErrorIfAny() {
  if (chrome.runtime.lastError) {
    error(chrome.runtime.lastError);
  }
}
