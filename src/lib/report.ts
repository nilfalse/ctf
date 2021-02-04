import { Match } from '../interceptors';
import * as countryService from '../services/country/country_service';
import { flags } from '../services/emoji/emoji_service';
import * as iconService from '../services/icon/icon_service';
import * as debug from '../util/debug';

import { Request } from './request';

interface JSONSerializedReport {
  request: Request;
  traceroute?: ReadonlyArray<Match>;
}

export class Report {
  constructor(
    public request: Request,
    public traceroute: ReadonlyArray<Match> = []
  ) {}

  get iso() {
    const [firstMatch] = this.traceroute;

    return firstMatch.isoCountry;
  }

  get countryName() {
    debug.assert(
      !this.isEmpty,
      'Cannot retrieve countryName for an empty report'
    );

    return countryService.getName(this.iso);
  }

  get flag() {
    debug.assert(!this.isEmpty, 'Cannot lookup flag from an empty report');

    return flags.lookup(this.iso);
  }

  get icon() {
    return this.isEmpty
      ? iconService.defaultIconPromise
      : iconService.getIcon(this);
  }

  get isEmpty() {
    return this.traceroute.length === 0;
  }

  static fromJSON(json: JSONSerializedReport) {
    const request = Request.fromJSON(json.request);

    return new Report(request, json.traceroute);
  }
}
