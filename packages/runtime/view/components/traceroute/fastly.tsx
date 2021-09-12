import { FC } from 'react';

import { Match } from '../../../interceptors';
import { FastlyMatch } from '../../../interceptors/fastly';
import { Request } from '../../../lib/request';
import { assert } from '../../../util/debug';
import { Link, Paragraph, Span } from '../typography';

import { CountryItem } from './_country_item';

interface FastlyTraceProps {
  match: Match;
  request: Request;
}

function assertIsFastlyMatch(match: Match): asserts match is FastlyMatch {
  assert(
    !match || match.heuristic === 'fastly',
    'Non Fastly Match passed to Fastly Trace'
  );
}

export const FastlyTrace: FC<FastlyTraceProps> = ({ match }) => {
  assertIsFastlyMatch(match);

  const cacheStatus = match.extra.cacheStatus && (
    <Paragraph variant="light" size="xs">
      Cache Status was <Span variant="mono">{match.extra.cacheStatus}</Span> (
      <Link
        variant="light"
        size="xs"
        href="https://developer.fastly.com/learning/concepts/shielding/#debugging"
        target="_blank"
        title='What does "Cache status" mean?'
      >
        ?
      </Link>
      )
    </Paragraph>
  );

  return (
    <div className="fastly-trace">
      <Paragraph size="s">Fastly rerouted through</Paragraph>

      <div className="traceroute__nested">
        <CountryItem countryCode={match.isoCountry}>
          <strong>{match.extra.pop}</strong> data center in
        </CountryItem>
        {cacheStatus}
      </div>
    </div>
  );
};
