import { requests } from '../controllers/storage_controller';
import { CountryRequest } from '../lib/country_request';

export class UpdatePayloadsRepoCommand {
  constructor(public tabId: number, public request: CountryRequest | null) {}

  execute() {
    requests.update(this.tabId, this.request);
  }
}
