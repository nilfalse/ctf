import { requests } from '../background/repositories';
import { error } from '../debug';
import { render } from '../view/rendering';

const defaultIconPromise = render('🏁');

function reportErrorIfAny() {
  if (chrome.runtime.lastError) {
    error(chrome.runtime.lastError);
  }
}

async function handleTabUpdated(
  tabId: number,
  changeInfo: chrome.tabs.TabChangeInfo,
  tab: chrome.tabs.Tab
) {
  if (changeInfo.status !== 'loading') {
    return;
  }

  if (requests.fetch(tabId) === null) {
    chrome.pageAction.setPopup(
      { tabId, popup: 'popup.html' },
      reportErrorIfAny
    );
    chrome.pageAction.setIcon(
      { tabId, imageData: await defaultIconPromise },
      reportErrorIfAny
    );
    chrome.pageAction.show(tabId, reportErrorIfAny);
  }
}

export class InitTabUpdatedListenerCommand {
  execute() {
    chrome.tabs.onUpdated.addListener(
      module.hot ? (...args) => handleTabUpdated(...args) : handleTabUpdated
    );
  }
}
