import { BootCommand } from '../commands/boot';
import { TabRemoveCommand } from '../commands/tab_remove';
import { TabUpdateCommand } from '../commands/tab_update';
import * as mediator from '../util/mediator';

mediator.subscribe(BootCommand, function () {
  const controller = new TabController();

  chrome.tabs.onUpdated.addListener(controller.handleTabUpdated);

  chrome.tabs.onRemoved.addListener(controller.handleTabRemoved);
});

class TabController {
  handleTabUpdated(
    tabId: number,
    changeInfo: chrome.tabs.TabChangeInfo,
    tab: chrome.tabs.Tab
  ) {
    if (changeInfo.status !== 'loading') {
      return;
    }

    return mediator.publish(new TabUpdateCommand(tabId));
  }

  handleTabRemoved(tabId: number, removeInfo: chrome.tabs.TabRemoveInfo) {
    return mediator.publish(new TabRemoveCommand(tabId));
  }
}
