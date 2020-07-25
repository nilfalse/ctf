describe('Background page', () => {
  let backgroundPage;
  beforeAll(() => {
    const [page] = context.backgroundPages();
    backgroundPage = page;
  });

  it('should test', async () => {
    const result = await backgroundPage.evaluate(
      async () =>
        new Promise((resolve) => {
          chrome.tabs.query({ active: true }, resolve);
        })
    );

    console.log(result);
  });

  it('should intercept', async () => {
    const bgPromise = backgroundPage.evaluate(async () => {
      // chrome.webRequest.onCompleted.addListener = function (cb) {
      //   setTimeout(cb, 1000, { text: 'hello' });
      // };

      return new Promise((resolve) => {
        chrome.webRequest.onCompleted.addListener(
          resolve,
          {
            urls: ['<all_urls>'],
            types: ['main_frame'],
          },
          ['responseHeaders']
        );
      });
    });

    await page.route('**', (route) =>
      route.fulfill({
        status: 200,
        headers: {
          'Content-Type': 'text/plain',
          'X-nilfalse': 'hello',
        },
        body: 'Hello!',
      })
    );

    await page.goto('https://example.com');

    console.log(await bgPromise);
  });

  it('should not intercept', async () => {
    // but it does
    const bgPromise = backgroundPage.evaluate(async () => {
      return new Promise((resolve) => {
        chrome.webRequest.onCompleted.addListener(
          resolve,
          {
            urls: ['<all_urls>'],
            types: ['main_frame'],
          },
          ['responseHeaders']
        );
      });
    });

    await page.goto('https://example.com');

    console.log(await bgPromise);
  });
});
