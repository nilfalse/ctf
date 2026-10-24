import * as itinerary from '~/lib/itinerary/index.ts';
import type { Itinerary } from '~/lib/itinerary/interfaces.ts';
import * as action from '~/webext/action/index.ts';

import { baseHost } from '../webext/fetch/const.ts' with { type: 'macro' };

export async function hoist(tabId: number, it: Itinerary | undefined) {
  if (!it) {
    return;
  }

  await action.setPopup(tabId, `/popup.html?${itinerary.toSearchParams(it)}`);

  const country = it.hops.find((hop) => hop.country !== 'ZZ')?.country;
  if (!country) {
    return;
  }

  await action.setIcon(tabId, {
    path: `${baseHost}assets/twemoji/${country}.svg`,
  });
}
