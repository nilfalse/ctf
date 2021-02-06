import { defaultIconPromise } from '../services/icon/icon_service';

export class ReportEmptyCommand {
  constructor(public tabId: number) {}

  execute() {
    return defaultIconPromise;
  }
}
