# Capture The Flag [![Build status shield](https://travis-ci.com/nilfalse/ctf.svg?branch=main)](https://travis-ci.com/nilfalse/ctf) [![Dependencies status shield](https://badges.depfu.com/badges/c5efc2f68546b6c7cc2a0b1c896b2cd6/overview.svg)](https://depfu.com/github/nilfalse/ctf) [![Coverage status shield](https://coveralls.io/repos/github/nilfalse/ctf/badge.svg)](https://coveralls.io/github/nilfalse/ctf)

Yet another browser extension showing country flags in the address bar.

[![ESLint / Prettier](https://github.com/nilfalse/ctf/workflows/Lint/badge.svg)](https://github.com/nilfalse/ctf/actions?query=workflow%3ALint)
[![Maintainability](https://api.codeclimate.com/v1/badges/c81669d71480f9f1cac6/maintainability)](https://codeclimate.com/github/nilfalse/ctf)

[![Browser address bar demo illustration](./artwork/omnibox.svg)](https://nilfalse.com/addons/ctf)

## 💿 Prerequisites

<dl>
    <dt>
        <a href="https://blog.maxmind.com/2019/12/18/significant-changes-to-accessing-and-using-geolite2-databases/">MaxMind GeoIP database</a>
    </dt>
    <dd>
        <small>
            Since by design this extension requires a local copy of an ip→country database, it is essential that during development you provide it with one.
            You'll have to obtain a license key in order to use MaxMind GeoIP database.
            Refer to their blog (linked above) for more info on how to register for a free license key.
        </small>
    </dd>
    <dt>
        <a href="https://stedolan.github.io/jq/download/"><code>jq</code></a>
    </dt>
    <dd>
        <small>
            Some of the build steps in the codebase rely on <code>jq</code> being available in the system.
            Please refer to their website (linked above) for more details on how to install <code>jq</code> in your OS.
        </small>
    </dd>
</dl>

## 📦 Building

Make sure your MaxMind license key is available to the build script:

```sh
export MAXMIND_LICENSE_KEY=REPLACE_THIS_WITH_YOUR_KEY
```

Then just run:

```sh
make -j
```

Or, if you don't intend to do it often, then just do a one-liner:

```sh
MAXMIND_LICENSE_KEY=REPLACE_THIS_WITH_YOUR_KEY make -j
```

The default Make target downloads and builds all relevant assets and puts them inside the `./bundle` directory.

Subsequent builds can be significantly faster if you later use `build` target specifically:

```sh
make build
```

## 🛠️ Development

Download and install dependencies:

```sh
npm i
```

Ensure your MaxMind license key is available in the environment (see Building instructions above).

Then, run the watch mode:

```sh
npm start
```

<small>While it's building you may want to check out [how to load an unpacked extension](https://developer.chrome.com/extensions/faq#faq-dev-01) in Google Chrome.</small>

Once it's built you will be able to load it from the `./bundle` directory.

## 🎁 Release

<small>TODO</small>

## 👨‍💻 Credits

Author: [Yaroslav Ilin](https://ilin.dk)

## 📄 LICENSE

<small>TODO</small>
