import * as airports from '../services/airports/airports_service';
import * as emoji from '../services/emoji/emoji_service';

export class InitCommand {
  async execute() {
    await airports.init();
    await emoji.init();
  }
}
