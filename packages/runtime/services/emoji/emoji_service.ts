import { isKeyof, lookupUpperCase } from '../../util/common';
import * as debug from '../../util/debug';

const flagsByCode = Object.create(
  null
) as typeof import('country-flag-emoji-json/dist/by-code.json');

let ready = false;

export const flags = {
  lookup(code: string) {
    debug.assert(ready, 'Attempted to lookup emoji flag before init');
    assertKnownCode(code);

    return lookupUpperCase(flagsByCode, code);
  },
};

function assertKnownCode(
  code: string
): asserts code is keyof typeof flagsByCode {
  debug.assert(
    isKeyof(flagsByCode, code),
    `Unknown country code "${code}" in emojiService.flags lookup`
  );
}

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
  const promise = import('country-flag-emoji-json/dist/by-code.json').then(
    (flags) => {
      ready = true;

      return Object.assign(flagsByCode, flags.default);
    }
  );

  init = () => promise;
  return promise;
};
