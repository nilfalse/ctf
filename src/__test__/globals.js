const assert = require('assert');

const locale = require('../../bundle/_locales/en/messages.json');

const i18n = {
  getMessage: (key) => locale[key].message,
};

const browser = {
  i18n,
};

global.console.assert = assert;

global.chrome = browser;
