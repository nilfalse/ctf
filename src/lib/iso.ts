import { lookupUpperCase } from '../common';

export function getCountryName(code: string) {
  return import(
    /* webpackChunkName: "iso" */ 'i18n-iso-countries/langs/en.json'
  ).then(({ countries }) => {
    const countryName = lookupUpperCase(countries, code);

    return Array.isArray(countryName) ? countryName[0] : countryName;
  });
}
