import { TabDetails, tabDetails } from '../background/repo';

export class UpdateTabDetailsCommand {
  tabId: number;
  details: TabDetails | null;

  constructor(tabId: number, details: TabDetails | null) {
    this.tabId = tabId;
    this.details = details;
  }

  async execute() {
    if (this.details) {
      tabDetails.set(this.tabId, this.details);
    } else {
      tabDetails.delete(this.tabId);
    }
  }
}
