import { ActionRefreshCommand } from '../commands/action_refresh';
import { BootCommand } from '../commands/boot';
import { ReportReadyCommand } from '../commands/report_ready';
import { TabRemoveCommand } from '../commands/tab_remove';
import * as preferenceService from '../services/preference/preference_service';
import * as storageService from '../services/storage/storage_service';
import * as debug from '../util/debug';
import * as mediator from '../util/mediator';

mediator.subscribe(BootCommand, function () {
  browser.storage.onChanged.addListener(preferenceService.refresh);
});

mediator.subscribe(ReportReadyCommand, async function ({ tabId, report }) {
  storageService.reports.update(tabId, report);

  debug.log(`Tab#${tabId}: Report has been collected`, report);
  await mediator.publish(new ActionRefreshCommand(tabId));
});

mediator.subscribe(TabRemoveCommand, function ({ tabId }) {
  storageService.reports.remove(tabId);
});
