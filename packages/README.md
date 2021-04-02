# Developer documentation

## Overview

[![Maintainability](https://api.codeclimate.com/v1/badges/c81669d71480f9f1cac6/maintainability)](https://codeclimate.com/github/nilfalse/ctf)

In order to make the code codebase slightly more maintainable the product has been split into several micro packages with each being responsible for a smaller area. None of these packages is supposed to be published to NPM at the moment.

### Runtime

Most of the time a developer will be dealing with the package called `runtime`, since that is where most of the features live. Runtime is the implementation of webextension common code that is shared between Firefox and Chromium deployments.

### Firefox & Chromium

The `firefox` and `chromium` are meta packages both heavily relying on `runtime` under the hood. Since both platforms try to conform to the Web Extensions standard most of the time it's a good idea to implement a feature in the `runtime` package even if a certain API is currently supported only by one of the platforms.

### Bundler

The difference between the platforms so far has mostly been encountered in the build & deploy process, hence `bundler` is the base implementation of platform-agnostic bundling process utilizing `webpack`. The `firefox` and `chromium` consumers then override its bits and pieces taking into account their respective platform requirements.

### Bundle

In order to deliver the best experince to the user the extension requires some extra assets, therefore there's a `bundle` package which contains all things static. This is, for example, where the extension icon used by the brower goes as well as some third-party assets like the Twemoji flags.

### Landing

The marketing website is currently being developed under the `landing` umbrella.

### CDN

Microsite that goes to Cloudflare Pages utilizing their presense around the globe within milliseconds to the user in order to dynamically deliver GeoIP database over the last mile without the need to release new extension version.

### Command-Line Interface

Last but not least, there's a set of CLI-tools required to automate some of the pre-build routine. All things that work with external assets and services go to the `cli` package.
