// Evaluated at build time by unplugin-macros in Node, not in the extension.
declare const process: { env: Record<string, string | undefined> };

export const baseHost = process.env.CDN ?? 'https://ctf.pages.dev/';
