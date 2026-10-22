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

Read at build time by `npm start` / `npm run build`. Each flag names a browser capability or a bugfix.

| Variable              | Values                             | Effect                                                                                                   |
| --------------------- | ---------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `CDN`                 | `https://ctf.pages.dev/` (default) | Base URL of the datasets; keep the trailing slash                                                        |
| `FEATURE_PAGE_ACTION` | `0`, `1`                           | `1` to use `pageAction` or `0` for browser `action`; unset emits both in manifest and detects at runtime |
| `FEATURE_RELOAD_URL`  | `1`                                | On tab loading use `changeInfo.url` or `tab.url`                                                         |
| `FEATURE_DNS`         | `1`                                | Responses without an IP are resolved through DNS; adds the `dns` permission (Firefox API)                |

### Loading the extension

- **Chromium:** open `chrome://extensions`, enable _Developer mode_, click _Load unpacked_ and select `dist/`.
- **Firefox:** open `about:debugging#/runtime/this-firefox`, click _Load Temporary Add-on…_ and select `dist/manifest.json`.

## 👨‍💻 Author

[nilfalse](https://nilfalse.com)

## 📄 LICENSE

```
  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.
```
