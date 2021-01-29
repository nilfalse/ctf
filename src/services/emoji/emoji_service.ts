import { lookupUpperCase } from '../../util/common';
import * as debug from '../../util/debug';

const flagsByCode: typeof import('country-flag-emoji-json/json/flag-emojis-by-code.json') = Object.create(
  null
);

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
        code.toUpperCase() in flagsByCode,
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
