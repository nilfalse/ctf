import { TabDetails, tabDetails } from '../controllers/storage_controller';

export class UpdateTabDetailsCommand {
  constructor(public tabId: number, public details: TabDetails | null) {}

  execute() {
    tabDetails.update(this.tabId, this.details);
  }
}
