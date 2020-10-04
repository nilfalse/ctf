import { TabDetails, tabDetails } from '../background/repo';

export class UpdateTabDetailsCommand {
  constructor(public tabId: number, public details: TabDetails | null) {
    this.tabId = tabId;
    this.details = details;
  }

  execute() {
    if (this.details) {
      tabDetails.set(this.tabId, this.details);
    } else {
      tabDetails.delete(this.tabId);
    }
  }
}
