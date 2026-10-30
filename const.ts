// Evaluated at build time by unplugin-macros in Node, not in the extension.
declare const process: { env: Record<string, string | undefined> };

export const BASE_URL = process.env.CDN ?? 'https://ctf.pages.dev/';

export const FETCH_TIMEOUT = 20_000;

export const CURRENT_CACHE = 'v1';
