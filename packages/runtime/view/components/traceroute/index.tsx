import { FC } from 'react';

import { Match } from '../../../interceptors';
import { Request } from '../../../lib/request';
import { isKeyof } from '../../../util/common';
import { Sequence, SequenceItem } from '../sequence';
import { Paragraph } from '../typography';

import { CloudflareTrace } from './cloudflare';
import { CloudFrontTrace } from './cloudfront';
import { FastlyTrace } from './fastly';
import { IPTrace } from './ip';

import './index.css';

const traces = {
  ip: IPTrace,
  cloudflare: CloudflareTrace,
  cloudfront: CloudFrontTrace,
  fastly: FastlyTrace,
};

interface TracerouteProps {
  request: Request;
  traceroute: ReadonlyArray<Match>;
}

export const Traceroute: FC<TracerouteProps> = ({ request, traceroute }) => {
  const items = [];
  let ipItem = null;
  for (const match of traceroute) {
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
      <Paragraph variant="light" size="xs" className="traceroute__intro">
        Here's what we know from the request you've just made:
      </Paragraph>

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
