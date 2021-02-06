import { Tabs } from 'webextension-polyfill-ts';

import { BootCommand } from '../commands/boot';
import { TabRemoveCommand } from '../commands/tab_remove';
import { TabUpdateCommand } from '../commands/tab_update';
import * as mediator from '../util/mediator';

mediator.subscribe(BootCommand, function () {
  const controller = new TabController();

  browser.tabs.onUpdated.addListener(controller.handleTabUpdated);

  browser.tabs.onRemoved.addListener(controller.handleTabRemoved);
});

class TabController {
  handleTabUpdated(
    tabId: number,
    changeInfo: Tabs.OnUpdatedChangeInfoType,
    tab: Tabs.Tab
  ) {
    if (changeInfo.status !== 'loading') {
      return;
    }

    return mediator.publish(new TabUpdateCommand(tabId));
  }

  handleTabRemoved(tabId: number, removeInfo: Tabs.OnRemovedRemoveInfoType) {
    return mediator.publish(new TabRemoveCommand(tabId));
  }
}
