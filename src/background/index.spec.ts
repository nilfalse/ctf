import * as controller from './controller';

jest.mock('./controller');

describe('Background script', () => {
  it('should initialize background controller', () => {
    const browser = {};
    Object.defineProperty(globalThis, 'chrome', {
      writable: true,
      value: browser,
    });

    const testingSideEffect = require('.');

    expect(controller.init).toHaveBeenCalledWith({
      browser,
    });
    expect(controller.init).toHaveBeenCalledTimes(1);
  });
});
