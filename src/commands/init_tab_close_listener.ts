import { publish } from '../background/app';

import { UpdatePayloadsRepoCommand } from './update_payloads_repo';
import { UpdateTabDetailsCommand } from './update_tab_details';

export function handleTabClosed(
  tabId: number,
  removeInfo: chrome.tabs.TabRemoveInfo
) {
  publish(new UpdatePayloadsRepoCommand(tabId, null));
  publish(new UpdateTabDetailsCommand(tabId, null));
}

export class InitTabCloseListenerCommand {
  async execute() {
    chrome.tabs.onRemoved.addListener(
      module.hot ? (...args) => handleTabClosed(...args) : handleTabClosed
    );
  }
}
