import { FC } from 'react';

import { Match } from '../../../interceptors';
import { CloudFrontMatch } from '../../../interceptors/cloudfront';
import { Request } from '../../../lib/request';
import { assert } from '../../../util/debug';
import { Paragraph, Span } from '../typography';

import { CountryItem } from './_country_item';

interface CloudFrontTraceProps {
  match: Match;
  request: Request;
}

function assertIsCloudFrontMatch(
  match: Match
): asserts match is CloudFrontMatch {
  assert(
    !match || match.heuristic === 'cloudfront',
    'Non CloudFront Match passed to CloudFront Trace'
  );
}

export const CloudFrontTrace: FC<CloudFrontTraceProps> = ({ match }) => {
  assertIsCloudFrontMatch(match);

  const cacheStatus = match.extra.cacheStatus && (
    <Paragraph variant="light" size="xs">
      Cache: <Span variant="mono">{match.extra.cacheStatus}</Span>
    </Paragraph>
  );

  return (
    <div className="cloudfront-trace">
      <Paragraph size="s">AWS CloudFront routed through</Paragraph>

      <div className="traceroute__nested">
        <CountryItem countryCode={match.isoCountry}>
          <strong>{match.extra.pop}</strong> data center in
        </CountryItem>
        {cacheStatus}
      </div>
    </div>
  );
};
