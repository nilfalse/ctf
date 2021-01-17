import { publish } from '../background/app';
import { requests } from '../background/repositories';
import { error } from '../debug';
import { CountryRequestParams } from '../lib/country_request';
import { render } from '../services/rendering';
import * as xpc from '../services/xpc';

import { CountryReplyCommand } from './country_reply';
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

interface WebRequestPayload extends CountryRequestParams {
  tabId: number;
}

function handleWebRequestCompleted(payload: WebRequestPayload) {
  const { tabId } = payload;

  if (tabId === -1) {
    return; // skip extension popups
  }

  publish(new CountryReplyCommand(tabId, payload));
}

export class InitCommand {
  execute() {
    this._subscribeXPC();
    this._subscribeToTabs();
    this._subscribeToNetwork();
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

  _subscribeToNetwork() {
    chrome.webRequest.onCompleted.addListener(
      module.hot
        ? (res) => handleWebRequestCompleted(res)
        : handleWebRequestCompleted,
      {
        urls: ['<all_urls>'],
        types: ['main_frame'],
      },
      ['responseHeaders']
    );
  }
}
