import { I18n } from 'webextension-polyfill-ts';

import * as locale from '../../../../bundle/content/_locales/en/messages.json';

import { stub } from './stub';

type LocaleRecord = Record<string, { message: string }>;

const i18nMock = {
  getMessage: (key: string) => (locale as LocaleRecord)[key].message,
};

export function i18n() {
  const browser = stub();

  beforeEach(() => {
    browser.i18n = i18nMock as I18n.Static;
  });

  afterEach(() => {
    browser.i18n = undefined as unknown as I18n.Static;
  });
}
