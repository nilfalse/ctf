import * as airports from '~/lib/airports.ts';
import * as clouds from '~/lib/clouds/index.ts';
import * as q from '~/lib/q.ts';
import * as action from '~/webext/action/index.ts';
import * as dns from '~/webext/dns.moz.ts';
import * as mem from '~/webext/mem.ts';
import * as net from '~/webext/net.ts';
import * as runtime from '~/webext/runtime.ts';
import * as tabs from '~/webext/tabs.ts';

net.listen(function (response) {
  console.log(`Tab#${response.tabId}: HTTP`, response);

  q.enqueue(response.tabId, async function () {
    if (typeof browser.dns === 'object' && !response.ip) {
      const { hostname } = new URL(response.url);
      response.ip = await dns.resolve(hostname);
      console.log(`Tab#${response.tabId}: IP`, response.ip);
    }

    await mem.write(`r:${response.tabId}`, response);
  });
});

tabs.onLoading(function (tabId, url) {
  console.log(`Tab#${tabId}: loading`, url);

  q.conflate(tabId, async function () {
    const response = await mem.read<net.Payload>(`r:${tabId}`);

    const hops = await clouds.infer(response?.responseHeaders);
    console.log(`Tab#${tabId}: hops`, hops);

    const country = hops.find((hop) => hop.country)?.country;
    if (!country || country === 'ZZ') {
      return;
    }

    await action.setIcon(tabId, {
      path: `https://flagcdn.com/w40/${country.toLowerCase()}.png`,
    });
  });
});

tabs.onClosed(function (tabId) {
  console.log(`Tab#${tabId}: closed`);
  q.enqueue(tabId, () => mem.erase(`r:${tabId}`));
  q.unqueue(tabId);
});

runtime.onInstalled(async function () {
  console.log('Capture The Flag: installed');

  await airports.populate();
});
