import * as React from 'react';

import { CountryRequest } from '../../lib/country_request';

interface IPSectionProps {
  request: CountryRequest;
}

export const IPSection: React.FC<IPSectionProps> = ({ request }) => {
  if (!request.ip) {
    return <p>We could not determine the IP address of that website</p>;
  }

  return <p>IP: {request.ip}</p>;
};
