import { lookupUpperCase } from '../common';

export function fromISOCountryCode(code: string) {
  return import(
    /* webpackChunkName: "emoji" */ 'country-flag-emoji-json/json/flag-emojis-by-code.json'
  ).then((flags) => lookupUpperCase(flags.default, code));
}
