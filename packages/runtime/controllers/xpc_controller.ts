import { Runtime } from 'webextension-polyfill-ts';

import { BootCommand } from '../commands/boot';
import * as xpc from '../services/xpc/xpc_background_service';
import * as mediator from '../util/mediator';

mediator.subscribe(BootCommand, function () {
  browser.runtime.onMessage.addListener(
    module.hot
      ? // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        (payload, sender) => handleIncomingMessage(payload, sender)
      : handleIncomingMessage
  );
});

function handleIncomingMessage(
  message: xpc.Message,
  _sender: Runtime.MessageSender
) {
  return xpc.handle(message);
}
