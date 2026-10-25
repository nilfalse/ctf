# Capture The Flag (CTF) browser extension

MV3 WebExtension. Captures the HTTP response of each tab's top frame, finds the server's country (GeoIP) and the CDN POP, and shows the flag in the page action or browser action. The popup shows the details.

## Code

- `lib/q.ts`: per-tab promise queue.
- `lib/airports.ts`: IATA code to country, downloaded from ctf.pages.dev into `storage.local` on install.
- `lib/clouds/`: CDN hops (cloud, POP, country) inferred from response headers. Cloudflare only so far.
- `lib/country.ts`: country names (from `_locales`) and flag emoji.
- `lib/itinerary/`: a response turned into an itinerary (IP, hops, `Server`, `X-Powered-By`) by `factory.ts`; `codec.ts` encodes it as search params and back.
- `lib/history.ts`: per-tab LRU of itineraries keyed by origin, in `storage.session`.
- `lib/ensign.ts`: `hoist()` sets the tab's popup URL and icon from an itinerary. The icon comes from `lib/icons.ts`. `background.ts` calls it with the tab's history on `loading`, with `FEATURE_EVENTS_OUT_OF_ORDER` also after each response, and for every open tab when the `icons` preference changes.
- `lib/icons.ts`: `flag()` picks the action icon for a country by the `icons` preference: `twemoji` (the default) is the Twemoji SVG on ctf.pages.dev, `native` is the flag emoji in an SVG data URL (`lib/svg.ts`).
- `popup/`: `Popup.tsx` is a pure view, prerendered to `popup.html` at build time; `popup.runtime.tsx` hydrates it and reads the report from the search params that the background puts in the popup URL (`lib/itinerary/codec.ts`).
- `lib/prefs.ts`: the `Defaults` class declares every preference with its type and default (a deprecated one as an optional `declare` field, which emits nothing). `Prefs` extends it: `init()` assigns one bulk `storage.sync` read onto the instance, and `save(k, v)` assigns `v` and removes the key if `v` is the default (so a default is never stored, and saving `undefined` deletes a deprecated key) or sets it otherwise. `webext/prefs/storage.ts` has the `/* @inline */` `get`, `set`, `remove` and `onChanged`; `webext/prefs/listener.ts` has `heed()`, which `background.ts` imports directly.
- `lib/migration.ts`: `migrate()` runs on install and update and moves data left by older versions; each step must be a no-op once done. So far it runs `Prefs.migrate()` on the cached `prefs()` instance, which turns ctf-legacy's `render: 'emoji'` into `icons: 'native'` except on Windows (no flag emoji there), leaves `icons` unset otherwise, and removes `render`. Unknown keys are kept, because `storage.sync` is shared with the user's browsers, which may run other versions.

## Conventions

- **Features, never browsers.** Flags are `FEATURE_*`, named after a capability. The `-moz.ts`, `-chromium.ts` and `*.moz.ts` filenames only decide which tsconfig (`build/tsconfig.{moz,chromium}.json`) type-checks a file. Runtime and build branching is by feature and gets dead-code eliminated. Mention browser names only as evidence.
- **Thin platform layer:** everything that touches `browser.*` lives in `webext/`. `lib/` holds logic and imports `webext/` only for I/O. `browser` is the global from `build/types.*.d.ts`.
- **Small, independent modules.** No defensive layers without a concrete failure they prevent.
- **Code style:** Node ≥ 26, TypeScript 7 (`erasableSyntaxOnly`, so no enums or parameter properties), `~/` path alias, Prettier with single quotes and sorted imports (`npm run fmt`). Build-time helpers: `/* @inline */` (compilecat) and `with { type: 'macro' }` (unplugin-macros). Tests use the Vitest `test.extend` fixture style with Arrange/Act/Assert comments (see `lib/q.spec.ts`).
- **One-liner tests:** a test that is a single `expect(…)` call is written as that one call, without Arrange/Act/Assert, and in `*.spec.ts` files any arrow function with a single statement as its body drops its `{ }` (see `lib/itinerary/itinerary.spec.ts`).

## Permissions

- There is **no `tabs` permission** and none is to be added. Only `webRequest`, `storage` and `host_permissions: ["*://*/*"]` (plus `dns` with `FEATURE_DNS=1`). `tab.url` and `changeInfo.url` are therefore absent for URLs no host pattern covers, such as `about:blank`.

## Commands

Run from this directory.

## How to work here

- When unsure how a browser behaves, propose a small spike and run it rather than guessing. Put new findings in a `spike-*.md`.
- When asked to assess, assess first and don't implement.
