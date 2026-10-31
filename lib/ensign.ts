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

  const iso =
    it.hops.find((h) => h.country !== 'ZZ')?.country ||
    it.country ||
    it.registered ||
    'ZZ';

  return Promise.all([
    action.setPopup(tabId, `/popup.html?${itinerary.toSearchParams(it)}`),
    action.setTitle(tabId, _('TITLE', [_('EXT_NAME'), country.name(iso)])),
    icons.flag(iso).then((icon) => action.setIcon(tabId, icon)),
  ]);
}
