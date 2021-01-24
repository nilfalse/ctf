import * as emoji from '../services/emoji/emoji_service';

import './index.css';

export function start(callback?: () => void) {
  return emoji.init().then(callback);
}
