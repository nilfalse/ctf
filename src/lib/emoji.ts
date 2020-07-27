import * as flags from 'country-flag-emoji-json/json/flag-emojis-by-code.json';

import { isKeyof } from './_util';

export function fromISOCountryCode(code: string) {
  code = code.toUpperCase();
  if (isKeyof(flags, code)) {
    return flags[code];
  }

  return null;
}
