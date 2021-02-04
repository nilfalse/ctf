import { FC } from 'react';

import { Match } from '../../../interceptors';
import { IPMatch } from '../../../interceptors/ip';
import { Request } from '../../../lib/request';
import { assert } from '../../../util/debug';
import { Link, Paragraph, Span } from '../typography';

import { CountryItem } from './_country_item';

import './index.css';

interface CountryRequestWithMandatoryIP extends Request {
  ip: string;
}

function assertIsIPMatch(
  match: Match | undefined
): asserts match is IPMatch | undefined {
  assert(!match || match.heuristic === 'ip', 'Non IP Match passed to IP Trace');
}

function assertRequestHasIP(
  request: Request
): asserts request is CountryRequestWithMandatoryIP {
  assert(request.ip, 'Country Request does not contain any valid IP');
}

function getLink(ip: string) {
  const link = new URL(
    'https://apps.db.ripe.net/db-web-ui/query?source=GRS&bflag=true'
  );
  link.searchParams.set('searchtext', ip);

  return link.toString();
}

const CountryInfo: FC<{ match: Match | undefined }> = ({ match }) => {
  assertIsIPMatch(match);

  if (!match) {
    return (
      <div className="traceroute__nested">
        <Paragraph variant="light" size="xs">
          <em>
            There's no country information on the books for this IP address.
          </em>
        </Paragraph>
      </div>
    );
  }

  return (
    <div className="traceroute__nested">
      <CountryItem countryCode={match.isoCountry}>Country:</CountryItem>

      {match.extra ? (
        <CountryItem
          countryCode={match.extra.registeredCountry}
          shouldRenderFlag={match.isoCountry !== match.extra.registeredCountry}
        >
          Legal registration:
        </CountryItem>
      ) : null}
    </div>
  );
};

const ServerInfo: FC<{ request: CountryRequestWithMandatoryIP }> = ({
  request,
}) => {
  const serverHeader = request.getHeader('server');
  const poweredByHeader = request.getHeader('x-powered-by');

  if (!serverHeader && !poweredByHeader) {
    return null;
  }

  return (
    <div className="traceroute__nested">
      {serverHeader ? (
        <Paragraph size="xs">
          Server Software: <Span variant="mono">{serverHeader}</Span>
        </Paragraph>
      ) : null}
      {poweredByHeader ? (
        <Paragraph size="xs">
          Powered By: <Span variant="mono">{poweredByHeader}</Span>
        </Paragraph>
      ) : null}
    </div>
  );
};

interface IPTraceProps {
  match?: Match;
  request: Request;
}

export const IPTrace: FC<IPTraceProps> = ({ match, request }) => {
  assertRequestHasIP(request);

  const link = getLink(request.ip);

  return (
    <div className="ip-trace">
      <Paragraph size="s">
        You connected to IP <strong>{request.ip}</strong>&nbsp;
        <Link variant="light" size="xs" href={link} target="_blank">
          lookup
        </Link>
      </Paragraph>

      <CountryInfo match={match} />
      <ServerInfo request={request} />
    </div>
  );
};
