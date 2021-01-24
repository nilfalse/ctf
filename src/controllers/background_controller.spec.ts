import * as harness from '../__test__/harness';

import * as controller from './background_controller';

describe('Background controller', () => {
  const browser = harness.browser.mock();

  describe('when starting', () => {
    beforeEach(controller.start);

    it('should subscribe to network requests', () => {
      expect(browser.webRequest.onCompleted.addListener).toHaveBeenCalledTimes(
        1
      );

      expect(browser.webRequest.onCompleted.addListener).lastCalledWith(
        expect.any(Function),
        {
          urls: ['<all_urls>'],
          types: ['main_frame'],
        },
        ['responseHeaders']
      );
    });

    it('should subscribe to tab change events', () => {
      expect(browser.tabs.onUpdated.addListener).toHaveBeenCalledTimes(1);

      expect(browser.tabs.onUpdated.addListener).lastCalledWith(
        expect.any(Function)
      );
    });

    it('should subscribe to tab close events', () => {
      expect(browser.tabs.onRemoved.addListener).toHaveBeenCalledTimes(1);

      expect(browser.tabs.onRemoved.addListener).lastCalledWith(
        expect.any(Function)
      );
    });

    it('should subscribe to popup messages', () => {
      expect(browser.runtime.onMessage.addListener).toHaveBeenCalledTimes(1);

      expect(browser.runtime.onMessage.addListener).lastCalledWith(
        expect.any(Function)
      );
    });
  });
});
