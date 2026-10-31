import { _ } from '~/webext/i18n.ts';

import * as constants from './country.const.ts' with { type: 'macro' };

export const codes = constants.CODES;

export /* @inline */ function name(iso: TwoUppercaseLetters) {
  return _('COUNTRY_' + iso);
}

export function emoji(iso: TwoUppercaseLetters) {
  if (iso === 'ZZ') {
    return '🏁';
  }

  return codepoints(iso)
    .map((c) => String.fromCodePoint(c))
    .join('');
}

export function codepoints(iso: TwoUppercaseLetters) {
  return Array.prototype.map.call(
    iso,
    (char: string) => constants.REGIONAL_INDICATOR_OFFSET + char.charCodeAt(0),
  ) as number[];
}
