import * as background from '.';

describe('Background script', () => {
  it('should initialize listeners', async () => {
    const browser = {
      webRequest: { onCompleted: { addListener() {} } },
    };

    const spy = jest.spyOn(browser.webRequest.onCompleted, 'addListener');

    background.init({
      browser,
    });

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
