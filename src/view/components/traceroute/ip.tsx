import * as React from 'react';

import { assert } from '../../../debug';
import { Match } from '../../../heuristics';
import { IPMatch } from '../../../heuristics/ip';
import { CountryRequest } from '../../../lib/country_request';
import { Link, Typography } from '../typography';

import { CountryItem } from './_country_item';

import './index.css';

interface CountryRequestWithMandatoryIP extends CountryRequest {
  ip: string;
}

function assertIsIPMatch(
  match: Match | undefined
): asserts match is IPMatch | undefined {
  assert(!match || match.heuristic === 'ip', 'Non IP Match passed to IP Trace');
}

function assertRequestHasIP(
  request: CountryRequest
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

const CountryInfo: React.FC<{ match: Match | undefined }> = ({ match }) => {
  assertIsIPMatch(match);

  if (!match) {
    return (
      <div className="traceroute__nested">
        <Typography variant="light" size="xs">
          <em>
            There's no country information on the books for this IP address.
          </em>
        </Typography>
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

const ServerInfo: React.FC<{ request: CountryRequestWithMandatoryIP }> = ({
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
        <Typography size="xs">Server Software: {serverHeader}</Typography>
      ) : null}
      {poweredByHeader ? (
        <Typography size="xs">Powered By: {poweredByHeader}</Typography>
      ) : null}
    </div>
  );
};

interface IPTraceProps {
  match?: Match;
  request: CountryRequest;
}

export const IPTrace: React.FC<IPTraceProps> = ({ match, request }) => {
  assertRequestHasIP(request);

  const link = getLink(request.ip);

  return (
    <div className="ip-trace">
      <Typography size="s">
        You connected to IP <strong>{request.ip}</strong>&nbsp;
        <Link variant="light" size="xs" href={link} target="_blank">
          lookup
        </Link>
      </Typography>

      <CountryInfo match={match} />
      <ServerInfo request={request} />
    </div>
  );
};
