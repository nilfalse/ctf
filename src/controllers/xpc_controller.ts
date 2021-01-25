import { BootCommand } from '../commands/boot';
import * as xpc from '../services/xpc/xpc_background_service';
import * as mediator from '../util/mediator';

mediator.subscribe(BootCommand, function () {
  chrome.runtime.onMessage.addListener(
    module.hot
      ? (sender, payload, sendResponse) =>
          handleIncomingMessage(sender, payload, sendResponse)
      : handleIncomingMessage
  );
});

async function handleIncomingMessage(
  message: unknown,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: unknown) => void
) {
  sendResponse(await xpc.handle(message));
}
