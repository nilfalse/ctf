import * as React from 'react';

import { CountryRequest } from '../../lib/country_request';

import './server_section.css';

interface ServerSectionProps {
  request: CountryRequest;
}

export const ServerSection: React.FC<ServerSectionProps> = ({ request }) => {
  const serverHeader = request.getHeader('server');
  const server = serverHeader ? (
    <p className="server-section__item font_light">
      Software: <strong>{serverHeader}</strong>
    </p>
  ) : null;

  const poweredByHeader = request.getHeader('x-powered-by');
  const poweredBy = poweredByHeader ? (
    <p className="server-section__item font_light">
      Powered By: <strong>{poweredByHeader}</strong>
    </p>
  ) : null;

  return (
    <div className="server-section primary_light">
      <p className="server-section__item font_light">
        IP: {request.ip ? <IPLink ip={request.ip} /> : 'unknown'}
      </p>

      {server}

      {poweredBy}
    </div>
  );
};

const IPLink: React.FC<{ ip: string }> = ({ ip }) => {
  const url = new URL(
    'https://apps.db.ripe.net/db-web-ui/query?source=GRS&bflag=true'
  );
  url.searchParams.set('searchtext', ip);

  return (
    <a
      className="server-section__link font_bold"
      target="_blank"
      href={url.toString()}
    >
      {ip}
    </a>
  );
};
