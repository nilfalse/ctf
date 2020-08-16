import { InitWebRequestListenerCommand } from './init_webrequest_listener';
import { InitXPCDispatcherCommand } from './init_xpc_dispatcher';

describe('Commands', () => {
  describe('WebRequest Listener Init', () => {
    it('should setup listeners', async () => {
      const addListener = jest.fn();
      const browser = {
        webRequest: { onCompleted: { addListener } },
      };

      Object.defineProperty(globalThis, 'chrome', {
        writable: true,
        value: browser,
      });

      const command = new InitWebRequestListenerCommand();
      await command.execute();

      expect(addListener).toHaveBeenCalled();
    });
  });

  describe('XPC Dispatcher Init', () => {
    it('should setup listeners', async () => {
      const addListener = jest.fn();
      const browser = {
        runtime: { onMessage: { addListener } },
      };

      Object.defineProperty(globalThis, 'chrome', {
        writable: true,
        value: browser,
      });

      const command = new InitXPCDispatcherCommand();
      await command.execute();

      expect(addListener).toHaveBeenCalled();
    });
  });
});
