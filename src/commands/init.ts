import * as airports from '../services/airports/airports_service';

export class InitCommand {
  async execute() {
    await airports.init();
  }
}
