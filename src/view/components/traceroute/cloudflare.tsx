import * as React from 'react';

import { assert } from '../../../debug';
import { Match } from '../../../heuristics';
import { CloudflareMatch } from '../../../heuristics/cloudflare';
import { CountryRequest } from '../../../lib/country_request';
import { Link, Paragraph, Span } from '../typography';

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

  const cacheStatus = match.extra.cacheStatus && (
    <Paragraph variant="light" size="xs">
      Cache Status was <Span variant="mono">{match.extra.cacheStatus}</Span> (
      <Link
        variant="light"
        size="xs"
        href="https://support.cloudflare.com/hc/articles/200172516-Understanding-Cloudflare-s-CDN#h_bd959d6a-39c0-4786-9bcd-6e6504dcdb97"
        target="_blank"
        title='What does "Cache status" mean?'
      >
        ?
      </Link>
      )
    </Paragraph>
  );

  return (
    <div className="cloudflare-trace">
      <Paragraph size="s">Cloudflare anycast rerouted through</Paragraph>

      <div className="traceroute__nested">
        <CountryItem countryCode={match.isoCountry}>
          <strong>{match.extra.ray}</strong> data center in
        </CountryItem>
        {cacheStatus}
      </div>
    </div>
  );
};
