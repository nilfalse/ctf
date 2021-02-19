import { ActionRefreshCommand } from '../commands/action_refresh';
import { Icon } from '../services/icon/icon_service';
import * as iconService from '../services/icon/icon_service';
import * as storageService from '../services/storage/storage_service';
import * as debug from '../util/debug';
import * as mediator from '../util/mediator';

export interface ActionRefreshPayload {
  popup: string;
  icon: Icon | null;
  title: string | null;
}

mediator.subscribe(ActionRefreshCommand, async function ({ tabId }) {
  const report = storageService.reports.fetch(tabId);

  const action: ActionRefreshPayload = {
    popup: 'popup.html?tab=' + tabId,
    icon: null,
    title: null,
  };

  if (report === null || report.isEmpty) {
    action.icon = await iconService.defaultIconPromise;
  } else {
    // FIXME: implement localhost detection
    action.icon = await report.icon;

    action.title =
      browser.i18n.getMessage('ext_name') + ':\n' + report.countryName;
  }

  await refresh(tabId, action);
  debug.log(`Tab#${tabId}: ActionRefresh done`);
});

async function refresh(
  tabId: number,
  { popup, icon, title }: ActionRefreshPayload
) {
  if (title) {
    browser.pageAction.setTitle({ tabId, title });
  }

  const promises = [];
  if (popup) {
    promises.push(browser.pageAction.setPopup({ tabId, popup }));
  }
  promises.push(browser.pageAction.setIcon({ tabId, ...icon }));
  promises.push(browser.pageAction.show(tabId));
  await Promise.all(promises);
}
