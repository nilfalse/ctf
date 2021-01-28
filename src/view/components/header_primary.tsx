import { FC } from 'react';

import logo from '../../../artwork/logo_text.svg';
import { Match } from '../../interceptors';
import { Request } from '../../lib/request';
import * as countryService from '../../services/country/country_service';
import * as urlService from '../../services/url/url_service';

import { Logo } from './logo';
import { Paragraph } from './typography';

import './header_primary.css';

interface HeaderPrimaryProps {
  request: Request;
  traceroute: ReadonlyArray<Match>;
}

export const HeaderPrimary: FC<HeaderPrimaryProps> = ({
  request,
  traceroute,
}) => {
  if (traceroute.length === 0) {
    return (
      <div className="header-primary header-primary_empty">
        <img
          src={logo}
          alt={chrome.i18n.getMessage('ext_name')}
          className="header-primary__logo"
          aria-hidden={true}
        />

        <Paragraph
          variant="handwriting"
          size="l"
          className="header-primary__country"
        >
          Unknown country
        </Paragraph>
      </div>
    );
  }

  return (
    <div className="header-primary">
      <Logo color="light" className="header-primary__icon" />
      <img
        src={logo}
        alt={chrome.i18n.getMessage('ext_name')}
        className="header-primary__logo"
        aria-hidden={true}
      />

      {request.url ? (
        <Paragraph size="xs" className="header-primary__host">
          You loaded {urlService.getHost(request.url)} from
        </Paragraph>
      ) : null}

      <Paragraph
        variant="handwriting"
        size="l"
        className="header-primary__country"
      >
        {countryService.getName(traceroute[0].isoCountry)}
      </Paragraph>
    </div>
  );
};
