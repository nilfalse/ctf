import { PageAction } from 'webextension-polyfill-ts';

import { stub } from './stub';

export function pageAction() {
  const browser = stub();

  beforeEach(() => {
    browser.pageAction = {
      setTitle: jest.fn(),
      setPopup: jest.fn(),
      setIcon: jest.fn(),
      show: jest.fn(),
    } as unknown as PageAction.Static;
  });

  afterEach(() => {
    browser.pageAction = undefined as unknown as PageAction.Static;
  });
}
