import * as emojiService from '../services/emoji/emoji_service';

import './index.css';

export function start(callback?: () => void) {
  return Promise.all([emojiService.init()]).then(callback);
}
