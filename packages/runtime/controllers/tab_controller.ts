import { Tabs } from 'webextension-polyfill-ts';

import { ActionRefreshCommand } from '../commands/action_refresh';
import { BootCommand } from '../commands/boot';
import { TabRemoveCommand } from '../commands/tab_remove';
import * as mediator from '../util/mediator';

mediator.subscribe(BootCommand, function () {
  const controller = new TabController();

  browser.tabs.onActivated.addListener(controller.handleTabActivated);

  browser.tabs.onUpdated.addListener(controller.handleTabUpdated);

  browser.tabs.onRemoved.addListener(controller.handleTabRemoved);
});

class TabController {
  handleTabActivated({ tabId }: Tabs.OnActivatedActiveInfoType) {
    return mediator.publish(new ActionRefreshCommand(tabId));
  }

  handleTabUpdated(
    tabId: number,
    changeInfo: Tabs.OnUpdatedChangeInfoType,
    tab: Tabs.Tab
  ) {
    if (changeInfo.status !== 'loading') {
      return;
    }

    return mediator.publish(new ActionRefreshCommand(tabId));
  }

  handleTabRemoved(tabId: number, removeInfo: Tabs.OnRemovedRemoveInfoType) {
    return mediator.publish(new TabRemoveCommand(tabId));
  }
}
