import * as controller from './controller';

jest.mock('./controller');

describe('Background script', () => {
  it('should initialize background controller', () => {
    const testingSideEffect = require('.');

    expect(controller.init).toHaveBeenCalledTimes(1);
  });
});
