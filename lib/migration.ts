import { prefs } from '~/lib/prefs.ts';
import { clearCaches } from '~/webext/cache.ts';

import { CURRENT_CACHE } from '../const.ts' with { type: 'macro' };

export async function migrate() {
  await Promise.all([
    prefs().then((p) => p.migrate()),
    clearCaches(new Set([CURRENT_CACHE])),
  ]);
}
