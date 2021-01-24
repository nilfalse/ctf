import { InitCommand } from '../commands/init';
import { UpdatePayloadsRepoCommand } from '../commands/update_payloads_repo';
import { UpdateTabDetailsCommand } from '../commands/update_tab_details';
import { requests } from '../controllers/storage_controller';
import { render } from '../services/rendering/rendering_service';
import { error } from '../util/debug';
import * as mediator from '../util/mediator';

const defaultIconPromise = render('🏁');

mediator.subscribe(InitCommand, function () {
  chrome.tabs.onRemoved.addListener(
    module.hot ? (...args) => handleTabClosed(...args) : handleTabClosed
  );

  chrome.tabs.onUpdated.addListener(
    module.hot ? (...args) => handleTabUpdated(...args) : handleTabUpdated
  );
});

function handleTabClosed(tabId: number, removeInfo: chrome.tabs.TabRemoveInfo) {
  mediator.publish(new UpdatePayloadsRepoCommand(tabId, null));
  mediator.publish(new UpdateTabDetailsCommand(tabId, null));
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

function reportErrorIfAny() {
  if (chrome.runtime.lastError) {
    error(chrome.runtime.lastError);
  }
}
