import { Match } from '../interceptors';
import * as countryService from '../services/country/country_service';
import { flags } from '../services/emoji/emoji_service';
import * as renderingService from '../services/rendering/rendering_service';

import { Request } from './request';

interface JSONSerializedReport {
  request?: Request;
  traceroute?: ReadonlyArray<Match>;
}

export class Report {
  constructor(
    public request?: Request,
    public traceroute: ReadonlyArray<Match> = []
  ) {}

  get iso() {
    const [firstMatch] = this.traceroute;

    return firstMatch.isoCountry;
  }

  get countryName() {
    return countryService.getName(this.iso);
  }

  get flag() {
    return flags.lookup(this.iso);
  }

  get icons() {
    return renderingService.render(this);
  }

  get isEmpty() {
    return this.traceroute.length === 0;
  }

  static fromJSON(json: JSONSerializedReport) {
    const request = Request.fromJSON(json.request);

    return new Report(request, json.traceroute);
  }
}
