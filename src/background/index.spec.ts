import * as main from './main';

jest.mock('./main');

describe('Background script', () => {
  it('should call main entry point', () => {
    const chrome = {};
    Object.defineProperty(globalThis, 'chrome', {
      writable: true,
      value: chrome,
    });

    const testingSideEffect = require('.');

    expect(main.start).toHaveBeenCalledWith({
      browser: chrome,
    });
    expect(main.start).toHaveBeenCalledTimes(1);
  });
});
