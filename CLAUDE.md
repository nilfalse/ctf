# Capture The Flag (CTF) browser extension

MV3 WebExtension. Captures the HTTP response of each tab's top frame, finds the server's country (GeoIP) and the CDN POP, and shows the flag in the page action or browser action. The popup shows the details.

## Code

- `lib/airports.ts`: IATA code to country, downloaded from ctf.pages.dev into `storage.local` on install.
- `lib/clouds/`: CDN hops (cloud, POP, country) inferred from response headers: Cloudflare, AWS and Fastly.
- `lib/country.ts`: country names (from `_locales`) and flag emoji.
- `lib/ensign.ts`: sets a tab's icon and popup URL from an itinerary.
- `lib/history.ts`: per-tab LRU of itineraries keyed by origin, in `storage.session`.
- `lib/icons.ts`: the flag icon, by the `icons` preference. With `FEATURE_TOOLBAR_SVG` disabled the toolbar takes no SVG, so `offscreen/` draws it into `ImageData` on an offscreen page, because decoding SVG needs a DOM.
- `lib/itinerary/`: a response turned into an itinerary; `codec.ts` encodes it as search params and back.
- `lib/maxmind.ts`: IP → country from MaxMind GeoLite2 on ctf.pages.dev, cached in Cache Storage.
- `lib/migration.ts`: runs on install and update; each step must be a no-op once done. Unknown keys are kept, because `storage.sync` is shared with the user's other browsers, which may run other versions.
- `lib/prefs.ts`: every preference and its default is declared in `Defaults`; a default is never stored.
- `lib/q.ts`: per-tab promise queue.
- `popup/`: prerendered at build time; it reads its data from the popup URL's search params, not from messages.

## Conventions

- **Features, never browsers.** Flags are `FEATURE_*`, named after a capability. The `-moz.ts`, `-chromium.ts` and `*.moz.ts` filenames only decide which tsconfig (`build/tsconfig.{moz,chromium}.json`) type-checks a file. Runtime and build branching is by feature and gets dead-code eliminated. Mention browser names only as evidence.
- **Thin platform layer:** everything that touches `browser.*` lives in `webext/`. `lib/` holds logic and imports `webext/` only for I/O. `browser` is the global from `build/types.*.d.ts`.
- **Small, independent modules.** No defensive layers without a concrete failure they prevent.
- **Code style:** Node ≥ 26, TypeScript 7 (`erasableSyntaxOnly`, so no enums or parameter properties), `~/` path alias, Prettier with single quotes and sorted imports (`npm run fmt`). Build-time helpers: `/* @inline */` (compilecat) and `with { type: 'macro' }` (unplugin-macros). Tests use the Vitest `test.extend` fixture style with Arrange/Act/Assert comments (see `lib/q.spec.ts`).
- **One-liner tests:** a test that is a single `expect(…)` call is written as that one call, without Arrange/Act/Assert, and in `*.spec.ts` files any arrow function with a single statement as its body drops its `{ }` (see `lib/itinerary/itinerary.spec.ts`).

## Permissions

- There is **no `tabs` permission** and none is to be added. Only `webRequest`, `storage` and `host_permissions: ["*://*/*"]` (plus `dns` with `FEATURE_DNS`, and `offscreen` with `FEATURE_TOOLBAR_SVG` disabled). `tab.url` and `changeInfo.url` are therefore absent for URLs no host pattern covers, such as `about:blank`.

## Commands

Run from this directory.

## How to work here

- When unsure how a browser behaves, propose a small spike and run it rather than guessing. Put new findings in a `spike-*.md`.
- When asked to assess, assess first and don't implement.
