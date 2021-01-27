import { lookupUpperCase } from '../../util/common';
import * as debug from '../../util/debug';

const flagsByCode = {} as typeof import('country-flag-emoji-json/json/flag-emojis-by-code.json');

let ready = false;

export const flags = {
  lookup(code: string) {
    debug.assert(ready, 'Attempted to lookup emoji flag before init');

    return lookupUpperCase(flagsByCode, code);
  },
};

export const twemoji = {
  getFilePath(code: string) {
    if (ready) {
      debug.assert(
        Object.hasOwnProperty.call(flagsByCode, code.toUpperCase()),
        `Unexpected countryCode "${code}" in emojiService.twemoji`
      );
    }

    return `/assets/twemoji/${code.toLowerCase()}.svg`;
  },
};

export let init = function () {
  const promise = import(
    'country-flag-emoji-json/json/flag-emojis-by-code.json'
  ).then((flags) => {
    ready = true;

    return Object.assign(flagsByCode, flags.default);
  });

  init = () => promise;
  return promise;
};
