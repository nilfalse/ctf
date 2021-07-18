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
  handleTabActivated(this: void, { tabId }: Tabs.OnActivatedActiveInfoType) {
    void mediator.publish(new ActionRefreshCommand(tabId));
  }

  handleTabUpdated(
    this: void,
    tabId: number,
    changeInfo: Tabs.OnUpdatedChangeInfoType,
    _tab: Tabs.Tab
  ) {
    if (changeInfo.status !== 'loading') {
      return;
    }

    void mediator.publish(new ActionRefreshCommand(tabId));
  }

  handleTabRemoved(
    this: void,
    tabId: number,
    _removeInfo: Tabs.OnRemovedRemoveInfoType
  ) {
    void mediator.publish(new TabRemoveCommand(tabId));
  }
}
