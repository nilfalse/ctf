import * as airports from '../services/airports/airports_service';
import * as emoji from '../services/emoji/emoji_service';
import * as geo from '../services/geo/geo_service';

export class BootCommand {
  execute() {
    return Promise.all([geo.init(), airports.init(), emoji.init()]);
  }
}
