import * as main from './main';

describe("Background's main entry point", () => {
  it('should initialize listeners', async () => {
    const addListener = jest.fn();
    const browser: unknown = {
      webRequest: { onCompleted: { addListener } },
    };

    main.start({
      browser: browser as typeof chrome,
    });

    expect(addListener).toHaveBeenCalled();
  });
});
