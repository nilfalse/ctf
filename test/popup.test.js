describe('Popup', () => {
  let runtime = null;
  beforeAll(async () => {
    const [backgroundPage] = context.backgroundPages();

    runtime = await backgroundPage.evaluate('chrome.runtime');
  });

  it('should say Hello World', async () => {
    await page.goto(`chrome-extension://${runtime.id}/popup/intro.html`);

    const browser = await page.$eval('h1', (el) => el.innerHTML);

    expect(browser).toContain('Hello World');
  });
});
