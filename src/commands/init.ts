import { requests } from '../controllers/storage_controller';
import { render } from '../services/rendering/rendering_service';
import * as xpc from '../services/xpc/xpc_service';
import { error } from '../util/debug';
import { publish } from '../util/mediator';

import { UpdatePayloadsRepoCommand } from './update_payloads_repo';
import { UpdateTabDetailsCommand } from './update_tab_details';

const defaultIconPromise = render('🏁');

function reportErrorIfAny() {
  if (chrome.runtime.lastError) {
    error(chrome.runtime.lastError);
  }
}

function handleTabClosed(tabId: number, removeInfo: chrome.tabs.TabRemoveInfo) {
  publish(new UpdatePayloadsRepoCommand(tabId, null));
  publish(new UpdateTabDetailsCommand(tabId, null));
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

async function handleIncomingMessage(
  message: unknown,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: unknown) => void
) {
  sendResponse(await xpc.handle(message));
}

export class InitCommand {
  execute() {
    this._subscribeXPC();
    this._subscribeToTabs();
  }

  _subscribeXPC() {
    chrome.runtime.onMessage.addListener(
      module.hot
        ? (sender, payload, sendResponse) =>
            handleIncomingMessage(sender, payload, sendResponse)
        : handleIncomingMessage
    );
  }

  _subscribeToTabs() {
    chrome.tabs.onRemoved.addListener(
      module.hot ? (...args) => handleTabClosed(...args) : handleTabClosed
    );

    chrome.tabs.onUpdated.addListener(
      module.hot ? (...args) => handleTabUpdated(...args) : handleTabUpdated
    );
  }
}
