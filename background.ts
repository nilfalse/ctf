import * as airports from '~/lib/airports.ts';
import * as history from '~/lib/history.ts';
import * as itinerary from '~/lib/itinerary/index.ts';
import * as q from '~/lib/q.ts';
import * as action from '~/webext/action/index.ts';
import * as net from '~/webext/net.ts';
import * as runtime from '~/webext/runtime.ts';
import * as tabs from '~/webext/tabs.ts';

net.listen(function (response) {
  console.log(`Tab#${response.tabId}: HTTP`, response);

  q.enqueue(response.tabId, async function () {
    const url = new URL(response.url);

    const it = await itinerary.of(url, response);
    await history.remember(`r:${response.tabId}`, url.origin, it);
  });
});

tabs.onLoading(function (tabId, url) {
  console.log(`Tab#${tabId}: loading`, url);

  q.conflate(tabId, async function () {
    const { origin } = new URL(url);

    const it = await history.retain(`r:${tabId}`, origin);
    if (!it) {
      return;
    }

    await action.setPopup(tabId, `/popup.html?${itinerary.toSearchParams(it)}`);

    const country = it.hops.find((hop) => hop.country !== 'ZZ')?.country;
    if (!country) {
      return;
    }

    await action.setIcon(tabId, {
      path: `https://flagcdn.com/w40/${country.toLowerCase()}.png`,
    });
  });
});

tabs.onClosed(function (tabId) {
  console.log(`Tab#${tabId}: closed`);
  q.enqueue(tabId, () => history.forget(`r:${tabId}`));
  q.unqueue(tabId);
});

runtime.onInstalled(async function () {
  console.log('Capture The Flag: installed');

  await airports.populate();
});
