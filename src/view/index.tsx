import * as emojiService from '../services/emoji/emoji_service';
import * as preferencesService from '../services/preference/preference_service';

import './index.css';

export function start(callback?: () => void) {
  return Promise.all([preferencesService.init(), emojiService.init()]).then(
    callback
  );
}
