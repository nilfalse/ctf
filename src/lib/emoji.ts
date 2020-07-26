import * as flags from 'country-flag-emoji-json/json/flag-emojis-by-code.json';

function isKeyof<T extends object>(
  obj: T,
  possibleKey: keyof any
): possibleKey is keyof T {
  return possibleKey in obj;
}

export function fromISOCountryCode(code: string) {
  code = code.toUpperCase();
  if (isKeyof(flags, code)) {
    return flags[code];
  }

  return null;
}
