import * as React from 'react';

import { CountryRequest } from '../../lib/country_request';

import { Typography } from './typography';

import './server_section.css';

interface ServerSectionProps {
  request: CountryRequest;
}

const IPLink: React.FC<{ ip: string }> = ({ ip }) => {
  const url = new URL(
    'https://apps.db.ripe.net/db-web-ui/query?source=GRS&bflag=true'
  );
  url.searchParams.set('searchtext', ip);

  return (
    <a className="server-section__link" target="_blank" href={url.toString()}>
      {ip}
    </a>
  );
};

export const ServerSection: React.FC<ServerSectionProps> = ({ request }) => {
  const serverHeader = request.getHeader('server');
  const server = serverHeader ? (
    <Typography variant="light" size="xs" className="server-section__item">
      Software: <strong>{serverHeader}</strong>
    </Typography>
  ) : null;

  const poweredByHeader = request.getHeader('x-powered-by');
  const poweredBy = poweredByHeader ? (
    <Typography variant="light" size="xs" className="server-section__item">
      Powered By: <strong>{poweredByHeader}</strong>
    </Typography>
  ) : null;

  return (
    <div className="server-section">
      <Typography variant="light" size="xs" className="server-section__item">
        IP: {request.ip ? <IPLink ip={request.ip} /> : 'unknown'}
      </Typography>

      {server}

      {poweredBy}
    </div>
  );
};
