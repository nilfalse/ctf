import * as xpc from '../lib/xpc';

export async function handleIncomingMessage(
  message: unknown,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: unknown) => void
) {
  sendResponse(await xpc.handle(message));
}

export class InitXPCDispatcherCommand {
  async execute() {
    chrome.runtime.onMessage.addListener(
      module.hot
        ? (sender, payload, sendResponse) =>
            handleIncomingMessage(sender, payload, sendResponse)
        : handleIncomingMessage
    );
  }
}
