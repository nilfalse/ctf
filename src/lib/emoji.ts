import flags from 'country-flag-emoji-json/json/flag-emojis-by-code.json';

import { lookupUpperCase } from '../common';

export function fromISOCountryCode(code: string) {
  return lookupUpperCase(flags, code);
}
