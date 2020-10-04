import * as React from 'react';

import { isKeyof } from '../../../common';
import { Match } from '../../../heuristics';
import { CountryRequest } from '../../../lib/country_request';
import { Sequence, SequenceItem } from '../sequence';
import { Typography } from '../typography';

import { CloudflareTrace } from './cloudflare';
import { IPTrace } from './ip';

import './index.css';

const traces = {
  ip: IPTrace,
  cloudflare: CloudflareTrace,
};

interface TracerouteProps {
  request: CountryRequest;
  matches: ReadonlyArray<Match>;
}

export const Traceroute: React.FC<TracerouteProps> = ({ request, matches }) => {
  const items = [];
  let ipItem = null;
  for (const match of matches) {
    if (match.heuristic === 'ip') {
      ipItem = <IPTrace request={request} match={match} />;
    } else if (isKeyof(traces, match.heuristic)) {
      const TraceComponent = traces[match.heuristic];

      items.push(<TraceComponent match={match} request={request} />);
    }
  }
  if (!ipItem) {
    ipItem = <IPTrace request={request} />;
  }
  if (ipItem) {
    items.unshift(ipItem);
  }

  return (
    <div className="traceroute">
      <Typography variant="light" size="xs" className="traceroute__intro">
        Here's what we know from the request you've just made:
      </Typography>

      <Sequence>
        {items.map((children, idx) => (
          <SequenceItem key={idx} isActive={idx === 0}>
            <div className="traceroute__item">{children}</div>
          </SequenceItem>
        ))}
      </Sequence>
    </div>
  );
};
