import { Report } from '../lib/report';

export class ReportReadyCommand {
  constructor(public tabId: number, public report: Report) {}

  execute() {
    // noop
  }
}
