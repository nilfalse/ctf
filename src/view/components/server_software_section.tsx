import * as React from 'react';

import { CountryRequest } from '../../lib/country_request';

interface ServerSoftwareSectionProps {
  request: CountryRequest;
}

export const ServerSoftwareSection: React.FC<ServerSoftwareSectionProps> = ({
  request,
}) => {
  const server = request.getHeader('server');

  if (!server) {
    return (
      <p>
        <em>The server did not report what software it used</em>
      </p>
    );
  }

  return (
    <p>
      Server software: <strong>{server}</strong>
    </p>
  );
};
