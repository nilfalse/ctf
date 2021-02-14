import { Dns } from 'webextension-polyfill-ts';

import * as debug from '../../util/debug';
import { supportsResolveDNS } from '../env/env_service';

export async function offline(hostname: string) {
  const record = await _resolve(hostname, ['offline']);

  return record.addresses;
}

function _resolve(hostname: string, flags: Dns.ResolveFlags) {
  debug.assert(
    supportsResolveDNS,
    'Attempted to call browser.dns.resolve() in a non-Firefox environment'
  );

  return browser.dns.resolve(hostname, flags);
}
