[<img src="https://raw.githubusercontent.com/nilfalse/nilfalse.github.io/refs/heads/main/images/ctf/logo/logo.svg" alt="Capture The Flag Logo" width="110px" align="left" />](https://nilfalse.com/addons/ctf)

# [Capture The Flag](https://nilfalse.com/addons/ctf)

[![CI status shield](https://github.com/nilfalse/ctf/workflows/CI/badge.svg)](https://github.com/nilfalse/ctf/actions?query=workflow%3ACI)
[![Dependencies status shield](https://badges.depfu.com/badges/c5efc2f68546b6c7cc2a0b1c896b2cd6/overview.svg)](https://depfu.com/github/nilfalse/ctf)
[![Coverage percentage shield](https://coveralls.io/repos/github/nilfalse/ctf/badge.svg)](https://coveralls.io/github/nilfalse/ctf)

**Capture The Flag** is a privacy-focused browser extension for Firefox and Chromium which makes all sorts of meta information inferred from a website HTTP request accessible to the user.

[![Browser address bar demo illustration](https://raw.githubusercontent.com/nilfalse/nilfalse.github.io/refs/heads/main/images/ctf/omnibox.svg)](https://nilfalse.com/addons/ctf)

It features a nice and clean UI which can:

- translate a server's IP address to country
- show which CDN and point-of-presense were used to deliver the website
- visualize how traffic has travelled before reaching your device

## 🛠 Development

Requires Node.js **26 or newer**.

```sh
npm i
npm test         # run unit tests with Vitest
npm start        # build in watch mode into dist/
npm run build    # one-off production build into dist/
npm run fmt      # format with Prettier
npm run popup    # watch popup UI in the browser via Vite dev server
```

### Environment variables

Read at build time by `npm start` / `npm run build`. Each flag names a browser capability or a quirk. The `FEATURE_*` flags are also set in `.env.[mode]` file; the shell environment takes precedence. A flag is on when set to any non-empty value; empty or unset is off, unless otherwise noted.

| Variable                      | Effect                                                                                                                                                                                                                                                                                                          |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CDN`                         | Base URL of the datasets (defaults to `https://ctf.pages.dev/`); keep the trailing slash                                                                                                                                                                                                                        |
| `FEATURE_PAGE_ACTION`         | Any non-empty value enables `pageAction` or set to empty for browser `action`; unset emits both in manifest and detects at runtime                                                                                                                                                                              |
| `FEATURE_TAB_URL`             | Whether the [`tabs.onUpdated` listener](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/onUpdated#parameters) will get the URL from `tab` or `changeInfo`.                                                                                                                      |
| `FEATURE_DNS`                 | Firefox delivers cached responses without an IP; query offline DNS using the `dns` permission in this case                                                                                                                                                                                                      |
| `FEATURE_EVENTS_OUT_OF_ORDER` | Firefox in some cases delivers `webRequest` event after `tabs.onLoading`; enable this feature to update the omnibar action from both events                                                                                                                                                                     |
| `FEATURE_TOOLBAR_SVG`         | Opt-out: set to empty explicitly to disable. The toolbar icon takes an SVG `path`; empty draws it into `ImageData` on an offscreen page instead, with the `offscreen` permission ([Chromium](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/icons#browser_compatibility)) |
| `FEATURE_SERVICE_WORKER`      | Enable to run the background as `service_worker` or set to empty for `scripts`; unset emits both in manifest, preferring the service worker ([`manifest.json` `background`](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/background#browser_support))                   |

### Loading the extension

- **Firefox:** open `about:debugging#/runtime/this-firefox`, click _Load Temporary Add-on…_ and select `dist/manifest.json`.
- **Chromium:** open `chrome://extensions`, enable _Developer mode_, click _Load unpacked_ and select `dist/`.

## 👨‍💻 Author

[nilfalse](https://nilfalse.com)

## 📄 LICENSE

```
  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.
```
