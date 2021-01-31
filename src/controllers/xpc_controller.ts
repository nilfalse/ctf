import { Runtime } from 'webextension-polyfill-ts';

import { BootCommand } from '../commands/boot';
import * as xpc from '../services/xpc/xpc_background_service';
import * as mediator from '../util/mediator';

mediator.subscribe(BootCommand, function () {
  browser.runtime.onMessage.addListener(
    module.hot
      ? (sender, payload) => handleIncomingMessage(sender, payload)
      : handleIncomingMessage
  );
});

async function handleIncomingMessage(
  message: unknown,
  sender: Runtime.MessageSender
) {
  return xpc.handle(message);
}
