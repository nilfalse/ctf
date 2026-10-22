export function _(messageName: string, substitutions?: string[] | string) {
  return browser.i18n.getMessage(messageName, substitutions);
}
