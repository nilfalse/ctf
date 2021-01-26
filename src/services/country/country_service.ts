export function getName(isoCode: string) {
  return chrome.i18n.getMessage('country_name_' + isoCode.toUpperCase());
}
