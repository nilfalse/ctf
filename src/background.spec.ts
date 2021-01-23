import * as controller from './background/controller';

jest.mock('./background/controller');

describe('Background script', () => {
  it('should initialize background controller', () => {
    const testingSideEffect = require('./background');

    expect(controller.start).toHaveBeenCalledTimes(1);
  });
});
