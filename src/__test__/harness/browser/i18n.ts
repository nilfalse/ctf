import * as locale from '../../../../bundle/_locales/en/messages.json';

import { stub } from './stub';

const i18nMock = {
  getMessage: (key) => locale[key].message,
};

export function i18n() {
  const browser = stub();

  beforeEach(() => {
    browser.i18n = i18nMock as typeof chrome.i18n;
  });

  afterEach(() => {
    delete browser.i18n;
  });
}
