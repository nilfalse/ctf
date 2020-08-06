import { countries } from 'i18n-iso-countries/langs/en.json';

import { lookupUpperCase } from '../common';

export function getCountryName(code: string) {
  const countryName = lookupUpperCase(countries, code);

  return Array.isArray(countryName) ? countryName[0] : countryName;
}
