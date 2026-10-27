let _offscreen: Promise<void> | undefined;

export function awaitOffscreen() {
  return (_offscreen ??= chrome.offscreen
    .hasDocument()
    .then((hasDocument) =>
      hasDocument
        ? undefined
        : chrome.offscreen.createDocument({
            url: 'offscreen.html',
            reasons: ['BLOBS'],
            justification: 'https://issues.chromium.org/issues/41250699',
          }),
    )
    .catch((err: unknown) => {
      _offscreen = undefined;
      throw err;
    }));
}
