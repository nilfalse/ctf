import { Request, requests } from '../background/repo';

export class UpdatePayloadsRepoCommand {
  constructor(public tabId: number, public request: Request | null) {
    this.tabId = tabId;
    this.request = request;
  }

  execute() {
    if (this.request) {
      requests.set(this.tabId, this.request);
    } else {
      requests.delete(this.tabId);
    }
  }
}
