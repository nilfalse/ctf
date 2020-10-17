import { requests } from '../background/repo';
import { error } from '../debug';

function reportErrorIfAny() {
  if (chrome.runtime.lastError) {
    error(chrome.runtime.lastError);
  }
}

function handleTabUpdated(
  tabId: number,
  changeInfo: chrome.tabs.TabChangeInfo,
  tab: chrome.tabs.Tab
) {
  if (changeInfo.status !== 'loading') {
    return;
  }

  if (!requests.has(tabId)) {
    chrome.pageAction.setPopup(
      { tabId, popup: 'popup.html' },
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
