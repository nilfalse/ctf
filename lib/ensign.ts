import * as icons from '~/lib/icons.ts';
import * as itinerary from '~/lib/itinerary/index.ts';
import type { Itinerary } from '~/lib/itinerary/interfaces.ts';
import * as action from '~/webext/action/index.ts';

export async function hoist(tabId: number, it: Itinerary | undefined) {
  if (!it) {
    return;
  }

  const promises: Promise<unknown>[] = [
    action.setPopup(tabId, `/popup.html?${itinerary.toSearchParams(it)}`),
  ];

  const iso = it.hops.find((hop) => hop.country !== 'ZZ')?.country;
  if (iso) {
    promises.push(icons.flag(iso).then((icon) => action.setIcon(tabId, icon)));
  }

  await Promise.all(promises);
}
