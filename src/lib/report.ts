import { Match } from '../interceptors';
import { flags } from '../services/emoji/emoji_service';
import { render } from '../services/rendering/rendering_service';

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

  get name() {
    const [firstMatch] = this.traceroute;

    return chrome.i18n.getMessage('country_name_' + firstMatch.isoCountry);
  }

  get iso() {
    const [firstMatch] = this.traceroute;

    return firstMatch.isoCountry;
  }

  get flag() {
    return flags.lookup(this.iso);
  }

  get icons() {
    return render(this.flag.emoji);
  }

  get isEmpty() {
    return this.traceroute.length === 0;
  }

  static fromJSON(json: JSONSerializedReport) {
    const request = Request.fromJSON(json.request);

    return new Report(request, json.traceroute);
  }
}
