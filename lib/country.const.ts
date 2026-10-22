import locale from '../resources/_locales/en/messages.json' with { type: 'json' };

export const REGIONAL_INDICATOR_OFFSET =
  '\u{1F1E6}'.codePointAt(0)! - 'A'.charCodeAt(0);

export const CODES = Object.keys(locale)
  .filter((key) => key.startsWith('COUNTRY_'))
  .map((key) => key.substring('COUNTRY_'.length) as TwoUppercaseLetters);
