import { countries } from 'i18n-iso-countries/langs/en.json';

import { isKeyof } from './_util';

export function getCountryName(code: string) {
  code = code.toUpperCase();
  if (isKeyof(countries, code)) {
    const countryName = countries[code];

    return Array.isArray(countryName) ? countryName[0] : countryName;
  }

  return null;
}
