import * as _ from '~/lib/_.ts';
import * as clouds from '~/lib/clouds/index.ts';
import { toHeaderMap } from '~/lib/http.ts';
import type { Itinerary } from '~/lib/itinerary/interfaces.ts';
import * as dns from '~/webext/dns.moz.ts';
import type * as net from '~/webext/net.ts';

export async function of(url: URL, response: net.Payload) {
  let ip = response.ip;
  if (typeof browser.dns === 'object' && !response.ip) {
    ip = await dns.resolve(url.hostname);
    console.log(`Tab#${response.tabId}: IP`, ip);
  }

  const headers = toHeaderMap(response.responseHeaders);
  const hops = await clouds.infer(headers);
  console.log(`Tab#${response.tabId}: hops`, hops);

  return {
    hostname: url.hostname,
    ip: ip!,
    hops,
    server: _.first(headers.get('server')),
    powered: _.first(headers.get('x-powered-by')),
  } as Itinerary;
}
