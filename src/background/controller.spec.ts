import * as controller from './controller';

describe('Background controller', () => {
  let browserMock: typeof chrome;

  beforeEach(() => {
    browserMock = ({
      runtime: { onMessage: { addListener: jest.fn() } },
      tabs: {
        onUpdated: { addListener: jest.fn() },
        onRemoved: { addListener: jest.fn() },
      },
      webRequest: {
        onCompleted: { addListener: jest.fn() },
      },

      pageAction: {},
    } as unknown) as typeof chrome;

    Object.defineProperty(globalThis, 'chrome', {
      writable: true,
      value: browserMock,
    });
  });

  describe('initialization', () => {
    beforeEach(controller.init);

    describe('of XPC', () => {
      it('should subscribe to messages', () => {
        expect(browserMock.runtime.onMessage.addListener).toHaveBeenCalledTimes(
          1
        );

        expect(browserMock.runtime.onMessage.addListener).lastCalledWith(
          expect.any(Function)
        );
      });
    });

    describe('of tabs', () => {
      it('should subscribe to tab update events', () => {
        expect(browserMock.tabs.onUpdated.addListener).toHaveBeenCalledTimes(1);

        expect(browserMock.tabs.onUpdated.addListener).lastCalledWith(
          expect.any(Function)
        );
      });

      it('should subscribe to tab close events', () => {
        expect(browserMock.tabs.onRemoved.addListener).toHaveBeenCalledTimes(1);

        expect(browserMock.tabs.onRemoved.addListener).lastCalledWith(
          expect.any(Function)
        );
      });
    });

    describe('of web request', () => {
      it('should subscribe to requests', () => {
        expect(
          browserMock.webRequest.onCompleted.addListener
        ).toHaveBeenCalledTimes(1);

        expect(browserMock.webRequest.onCompleted.addListener).lastCalledWith(
          expect.any(Function),
          {
            urls: ['<all_urls>'],
            types: ['main_frame'],
          },
          ['responseHeaders']
        );
      });
    });
  });
});
