import { Report } from '../lib/report';
import { render } from '../services/rendering/rendering_service';

const defaultIconPromise = render({
  iso: '--',
  flag: {
    emoji: '🏁',
  },
} as Report);

export class ReportEmptyCommand {
  constructor(public tabId: number) {}

  execute() {
    return defaultIconPromise;
  }
}
