import * as xpc from '../lib/xpc';

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

export async function handleIncomingMessage(
  message: any,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void
) {
  sendResponse(await xpc.handle(message));
}
