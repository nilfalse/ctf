import * as React from 'react';

import { assert } from '../../../debug';
import { Match } from '../../../heuristics';
import { CloudflareMatch } from '../../../heuristics/cloudflare';
import { CountryRequest } from '../../../lib/country_request';
import { Link, Typography } from '../typography';

import { CountryItem } from './_country_item';

interface CloudflareTraceProps {
  match: Match;
  request: CountryRequest;
}

function assertIsCloudflareMatch(
  match: Match
): asserts match is CloudflareMatch {
  assert(!match || match.heuristic === 'ip', 'Non IP Match passed to IP Trace');
}

export const CloudflareTrace: React.FC<CloudflareTraceProps> = ({ match }) => {
  assertIsCloudflareMatch(match);

  return (
    <div className="cloudflare-trace">
      <Typography size="s">Cloudflare anycast routed through</Typography>

      <div className="traceroute__nested">
        <CountryItem countryCode={match.isoCountry}>
          <strong>{match.extra.ray}</strong> data center in
        </CountryItem>
        <Typography variant="light" size="xs">
          Cache Status was {match.extra.cacheStatus} (
          <Link
            variant="light"
            size="xs"
            href="https://support.cloudflare.com/hc/articles/200172516-Understanding-Cloudflare-s-CDN#h_bd959d6a-39c0-4786-9bcd-6e6504dcdb97"
            target="_blank"
            title='what does "cache status" mean?'
          >
            ?
          </Link>
          )
        </Typography>
      </div>
    </div>
  );
};
