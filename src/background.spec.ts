import * as controller from './controllers/background_controller';

jest.mock('./controllers/background_controller');

describe('Background script', () => {
  it('should initialize background controller', () => {
    const testingSideEffect = require('./background');

    expect(controller.start).toHaveBeenCalledTimes(1);
  });
});
