import * as airports from '~/lib/airports.ts';
import * as ensign from '~/lib/ensign.ts';
import * as history from '~/lib/history.ts';
import * as itinerary from '~/lib/itinerary/index.ts';
import * as migration from '~/lib/migration.ts';
import * as q from '~/lib/q.ts';
import * as net from '~/webext/net.ts';
import * as prefs from '~/webext/prefs/listener.ts';
import * as runtime from '~/webext/runtime/hooks.ts';
import * as tabs from '~/webext/tabs.ts';

net.listen(function (response) {
  console.log(`Tab#${response.tabId}: HTTP`, response);

  q.enqueue(response.tabId, async function () {
    const url = new URL(response.url);

    const it = await itinerary.of(url, response);
    await history.remember(`r:${response.tabId}`, url.origin, it);
  });

  if (import.meta.env.FEATURE_EVENTS_OUT_OF_ORDER) {
    q.conflate(response.tabId, async () => {
      console.log(`Tab#${response.tabId}: conflate out of order`);
      const { origin } = new URL(response.url);

      const it = await history.retain(`r:${response.tabId}`, origin);
      console.log(`Tab#${response.tabId}: itinerary`, it);
      await ensign.hoist(response.tabId, it);
    });
  }
});

tabs.onLoading(function (tabId, url) {
  console.log(`Tab#${tabId}: loading`, url);

  q.conflate(tabId, async () => {
    console.log(`Tab#${tabId}: conflate`);

    const it = await history.retain(`r:${tabId}`, new URL(url).origin);
    console.log(`Tab#${tabId}: itinerary`, it);
    await ensign.hoist(tabId, it);
  });
});

prefs.heed('icons', async function () {
  for (const { id, url } of await tabs.query()) {
    q.conflate(id, async () => {
      console.log(`Tab#${id}: conflate due to prefs`);

      const it = await history.retain(`r:${id}`, new URL(url).origin);
      await ensign.hoist(id, it);
    });
  }
});

tabs.onClosed(function (tabId) {
  console.log(`Tab#${tabId}: closed`);

  q.enqueue(tabId, () => history.forget(`r:${tabId}`));
  q.unqueue(tabId);
});

runtime.onInstalled(async function () {
  console.log('Capture The Flag: installed');

  await Promise.all([airports.populate(), migration.migrate()]);
});
