import { render } from '../services/rendering/rendering_service';

const defaultIconPromise = render('🏁');

export class ReportEmptyCommand {
  constructor(public tabId: number) {}

  execute() {
    return defaultIconPromise;
  }
}
