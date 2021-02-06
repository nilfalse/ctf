import * as airportService from '../services/airport/airport_service';
import * as emojiService from '../services/emoji/emoji_service';
import * as geoService from '../services/geo/geo_service';
import * as preferenceService from '../services/preference/preference_service';

export class BootCommand {
  execute() {
    return Promise.all([
      preferenceService.init(),
      geoService.init(),
      airportService.init(),
      emojiService.init(),
    ]);
  }
}
