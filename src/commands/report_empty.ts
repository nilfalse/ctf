import { Report } from '../lib/report';
import { render } from '../services/rendering/rendering_service';

const defaultIconPromise = render(
  {
    iso: null,
    flag: {
      emoji: '🏁',
    },
  } as Report,
  'emoji'
);

export class ReportEmptyCommand {
  constructor(public tabId: number) {}

  execute() {
    return defaultIconPromise;
  }
}
