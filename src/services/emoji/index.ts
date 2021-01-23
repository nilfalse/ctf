import { lookupUpperCase } from '../../util/common';

export function fromISOCountryCode(code: string) {
  return import(
    'country-flag-emoji-json/json/flag-emojis-by-code.json'
  ).then((flags) => lookupUpperCase(flags.default, code));
}
