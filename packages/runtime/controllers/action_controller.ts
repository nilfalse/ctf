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
    popup: 'popup.html?tab=' + tabId.toString(),
    icon: null,
    title: null,
  };

  if (report === null) {
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

  await Promise.all([
    browser.pageAction.setPopup({ tabId, popup }),
    browser.pageAction.setIcon({ tabId, ...icon }),
    browser.pageAction.show(tabId),
  ]);
}
