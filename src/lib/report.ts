import { Match } from '../interceptors';
import { fromISOCountryCode } from '../services/emoji/emoji_service';
import { render } from '../services/rendering/rendering_service';

import { CountryRequest } from './country_request';

interface JSONSerializedReport {
  request?: CountryRequest;
  traceroute?: ReadonlyArray<Match>;
}

export class Report {
  constructor(
    public request?: CountryRequest,
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
    return fromISOCountryCode(this.iso);
  }

  get icons() {
    return this.flag.then((flag) => render(flag.emoji));
  }

  get isEmpty() {
    return this.traceroute.length === 0;
  }

  static fromJSON(json: JSONSerializedReport) {
    const request = CountryRequest.fromJSON(json.request);

    return new Report(request, json.traceroute);
  }
}
