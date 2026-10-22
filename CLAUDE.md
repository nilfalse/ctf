# Capture The Flag (CTF) browser extension

MV3 WebExtension. Captures the HTTP response of each tab's top frame, finds the server's country (GeoIP) and the CDN POP, and shows the flag in the page action or browser action. The popup shows the details.

## Code

- `lib/q.ts`: per-tab promise queue.
- `lib/airports.ts`: IATA code to country, downloaded from ctf.pages.dev into `storage.local` on install.
- `lib/clouds/`: CDN hops (cloud, POP, country) inferred from response headers. Cloudflare only so far.
- `lib/country.ts`: country names (from `_locales`) and flag emoji.
- `popup/`: `Popup.tsx` is a pure view, prerendered to `popup.html` at build time; `popup.runtime.tsx` hydrates it and reads the report from the search params that the background puts in the popup URL (`lib/itinerary/codec.ts`).

## Conventions

- **Features, never browsers.** Flags are `FEATURE_*`, named after a capability. The `-moz.ts`, `-chromium.ts` and `*.moz.ts` filenames only decide which tsconfig (`build/tsconfig.{moz,chromium}.json`) type-checks a file. Runtime and build branching is by feature and gets dead-code eliminated. Mention browser names only as evidence.
- **Thin platform layer:** everything that touches `browser.*` lives in `webext/`. `lib/` holds logic and imports `webext/` only for I/O. `browser` is the global from `build/types.*.d.ts`.
- **Small, independent modules.** No defensive layers without a concrete failure they prevent.
- **Code style:** Node ≥ 26, TypeScript 7 (`erasableSyntaxOnly`, so no enums or parameter properties), `~/` path alias, Prettier with single quotes and sorted imports (`npm run fmt`). Build-time helper: `with { type: 'macro' }` (unplugin-macros). Tests use the Vitest `test.extend` fixture style with Arrange/Act/Assert comments (see `lib/q.spec.ts`).
- **One-liner tests:** a test that is a single `expect(…)` call is written as that one call, without Arrange/Act/Assert, and in `*.spec.ts` files any arrow function with a single statement as its body drops its `{ }` (see `lib/itinerary/itinerary.spec.ts`).

## Permissions

- There is **no `tabs` permission** and none is to be added. Only `webRequest`, `storage` and `host_permissions: ["*://*/*"]` (plus `dns` with `FEATURE_DNS=1`). `tab.url` and `changeInfo.url` are therefore absent for URLs no host pattern covers, such as `about:blank`.

## Commands

Run from this directory.

## How to work here

- When unsure how a browser behaves, propose a small spike and run it rather than guessing. Put new findings in a `spike-*.md`.
- When asked to assess, assess first and don't implement.
