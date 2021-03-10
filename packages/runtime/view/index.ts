import * as emojiService from '../services/emoji/emoji_service';
import * as preferenceService from '../services/preference/preference_service';

import './index.css';

export const start = (callback?: () => void) =>
  Promise.all([preferenceService.init(), emojiService.init()]).then(callback);
