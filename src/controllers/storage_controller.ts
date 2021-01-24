import { ReportEmptyCommand } from '../commands/report_empty';
import { ReportReadyCommand } from '../commands/report_ready';
import { TabRemoveCommand } from '../commands/tab_remove';
import { TabUpdateCommand } from '../commands/tab_update';
import { Report } from '../lib/report';
import * as storageService from '../services/storage/storage_service';
import * as mediator from '../util/mediator';

mediator.subscribe(TabUpdateCommand, function ({ tabId }) {
  let report = storageService.reports.fetch(tabId);

  if (report === null) {
    report = new Report();
    storageService.reports.update(tabId, report);

    mediator.publish(new ReportEmptyCommand(tabId));
  }
});

mediator.subscribe(ReportReadyCommand, function ({ tabId, report }) {
  storageService.reports.update(tabId, report);
});

mediator.subscribe(TabRemoveCommand, function ({ tabId }) {
  storageService.reports.remove(tabId);
});
