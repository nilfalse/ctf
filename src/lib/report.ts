import { Match } from '../interceptors';
import { fromISOCountryCode } from '../services/emoji';
import { render } from '../services/rendering';

export class Report {
  constructor(public traceroute: ReadonlyArray<Match> = []) {}

  get isEmpty() {
    return this.traceroute.length === 0;
  }

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
}
