export function getName(isoCode: string) {
  return browser.i18n.getMessage('country_name_' + isoCode.toUpperCase());
}
