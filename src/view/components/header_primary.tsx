import * as React from 'react';

import logo from '../../../artwork/logo_text.svg';
import { Match } from '../../heuristics';
import { CountryRequest } from '../../lib/country_request';

import { Typography } from './typography';

import './header_primary.css';

interface HeaderPrimaryProps {
  request: CountryRequest;
  matches: ReadonlyArray<Match>;
}

function getHost(url: string) {
  const host = new URL(url).hostname;

  return host.startsWith('www.') ? host.substring(4) : host;
}

export const HeaderPrimary: React.FC<HeaderPrimaryProps> = ({
  request,
  matches,
}) => {
  if (matches.length === 0) {
    return <div className="header-primary header-primary_empty"></div>;
  }

  const host = request.url ? (
    <Typography variant="light" size="xs" className="header-primary__host">
      You've loaded {getHost(request.url)} from
    </Typography>
  ) : null;

  const country = chrome.i18n.getMessage(
    'country_name_' + matches[0].isoCountry
  );

  return (
    <div className="header-primary">
      <img
        src={logo}
        alt={chrome.i18n.getMessage('ext_name')}
        className="header-primary__logo"
        aria-hidden={true}
      />

      {host}

      <Typography
        variant="handwriting"
        size="l"
        className="header-primary__country"
      >
        {country}
      </Typography>
    </div>
  );
};
