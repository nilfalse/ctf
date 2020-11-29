import { TabDetails, tabDetails } from '../background/repositories';

export class UpdateTabDetailsCommand {
  constructor(public tabId: number, public details: TabDetails | null) {}

  execute() {
    tabDetails.update(this.tabId, this.details);
  }
}
