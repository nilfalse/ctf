import * as backgroundController from './controllers/background_controller';

jest.mock('./controllers/background_controller');

describe('Background script', () => {
  it('should initialize the background controller', () => {
    const testingSideEffect = require('./background');

    expect(backgroundController.start).toHaveBeenCalledTimes(1);
  });
});
