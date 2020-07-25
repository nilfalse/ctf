const pathToExtension = require('path').join(__dirname, '..', 'output');

// https://github.com/microsoft/playwright/blob/master/docs/api.md#working-with-chrome-extensions
module.exports = {
  browsers: ['chromium'],

  launchType: 'PERSISTENT',
  launchOptions: {
    headless: false,
    args: [
      `--disable-extensions-except=${pathToExtension}`,
      `--load-extension=${pathToExtension}`,
    ],
  },
};

// TODO
// https://github.com/aslushnikov/demo-playwright-with-firefox-web-extension
