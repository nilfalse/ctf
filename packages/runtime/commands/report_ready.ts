import { RequestParameters } from '../lib/request';
import * as reportService from '../services/report/report_service';
import * as debug from '../util/debug';

export class ReportReadyCommand {
  constructor(public tabId: number, public payload: RequestParameters) {
    debug.log(`Tab#${tabId}: Collecting new report`, payload);
  }

  execute() {
    return reportService.collect(this.payload);
  }
}
