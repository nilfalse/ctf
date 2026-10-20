import type Moz from 'webextension-polyfill';

// Firefox omits `ip` on some responses (e.g. served from cache). Opt-in via
// FEATURE_DNS, since it requires the `dns` permission.
export /* @inline */ async function resolve(hostname: string) {
  try {
    const record = await (browser as Moz.Browser).dns.resolve(hostname, [
      'offline',
    ]);

    console.log(`DNS: '${hostname}' is [${record.addresses?.join(', ')}]`);
    return record.addresses[0];
  } catch (err: unknown) {
    console.error(err);
  }
}
