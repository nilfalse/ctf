const assert = require('assert');

const fetch = require('node-fetch');

global.console.assert = assert;

global.fetch = (...args) => fetch.default(...args);

global.browser = {};
