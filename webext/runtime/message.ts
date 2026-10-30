export interface Intent {
  target: string;
}

export /* @inline */ function sendMessage<I extends Intent, O>(
  message: I,
): Promise<O> {
  return browser.runtime.sendMessage(message);
}

export /* @inline */ function on<O, I extends Intent>(
  t: I['target'],
  cb: (message: I) => Promise<O>,
) {
  function handleMessage(i: I, _s: unknown) {
    if (i.target === t) {
      // Supported in Chromium since 146
      // https://issues.chromium.org/issues/40753031
      return cb(i);
    }
  }

  type Listener = (m: unknown, s: unknown) => Promise<unknown>;
  browser.runtime.onMessage.addListener(handleMessage as Listener);
}
