import * as country from '~/lib/country.ts';
import * as icons from '~/lib/icons.ts';
import * as itinerary from '~/lib/itinerary/index.ts';
import type { Itinerary } from '~/lib/itinerary/interfaces.ts';
import * as action from '~/webext/action/index.ts';
import { _ } from '~/webext/i18n.ts';

export function hoist(tabId: number, it: Itinerary | undefined) {
  if (!it) {
    return;
  }

  const promises: Promise<unknown>[] = [
    action.setPopup(tabId, `/popup.html?${itinerary.toSearchParams(it)}`),
  ];

  const iso = it.hops.find((hop) => hop.country !== 'ZZ')?.country;
  if (iso) {
    promises.push(
      action.setTitle(
        tabId,
        _('EXT_NAME') + ':\n' + country.name(iso),
      ) as Promise<unknown>,

      icons.flag(iso).then((icon) => action.setIcon(tabId, icon)),
    );
  }

  return Promise.all(promises);
}
