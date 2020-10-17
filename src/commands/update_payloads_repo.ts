import { requests } from '../background/repo';
import { CountryRequest } from '../lib/country_request';

export class UpdatePayloadsRepoCommand {
  constructor(public tabId: number, public request: CountryRequest | null) {}

  execute() {
    if (this.request) {
      requests.set(this.tabId, this.request);
    } else {
      requests.delete(this.tabId);
    }
  }
}
