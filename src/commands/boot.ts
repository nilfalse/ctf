import * as airportsService from '../services/airports/airports_service';
import * as emojiService from '../services/emoji/emoji_service';
import * as geoService from '../services/geo/geo_service';

export class BootCommand {
  execute() {
    return Promise.all([
      geoService.init(),
      airportsService.init(),
      emojiService.init(),
    ]);
  }
}
