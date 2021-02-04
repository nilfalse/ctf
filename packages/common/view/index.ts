import * as emojiService from '../services/emoji/emoji_service';
import * as preferenceService from '../services/preference/preference_service';

import './index.css';

export function start(callback?: () => void) {
  return Promise.all([preferenceService.init(), emojiService.init()]).then(
    callback
  );
}
