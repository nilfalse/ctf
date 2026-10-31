import type { Hop } from '~/lib/clouds/interfaces.ts';
import type * as http from '~/lib/http.ts';

// cache-sjc10071-SJC or cache-rtm-ehrd2290057-RTM. Other servers set
// x-served-by too, such as "marketing-site" on www.cloudflare.com.
const NODE = /^cache-.+-([A-Z]{3})$/;

export function infer(headers: http.Headers) {
  function list(values: readonly string[] = []) {
    return values.flatMap((v) => v.split(',')).map((v) => v.trim());
  }

  const nodes = list(headers.get('x-served-by'));
  const statuses = list(headers.get('x-cache'));
  // x-cache is shared with other servers, and nodes may repeat on a restart.
  const isAligned = nodes.length === statuses.length;

  return nodes
    .flatMap(function (node, idx) {
      const pop = node.match(NODE)?.[1];
      if (!pop) {
        return [];
      }

      return {
        cloud: 'fastly',
        pop,
        cacheStatus: (isAligned && statuses[idx]) || null,
      } as Hop;
    })
    .reverse(); // Fastly lists the shield first and the edge last.
}
