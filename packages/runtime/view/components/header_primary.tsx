import { FC } from 'react';

import logo from '../../../../artwork/logo_text.svg';
import { Report } from '../../lib/report';

import { Logo } from './logo';
import { Paragraph } from './typography';

import './header_primary.css';

interface HeaderPrimaryProps {
  report: Report;
}

export const HeaderPrimary: FC<HeaderPrimaryProps> = ({ report }) => {
  if (report.traceroute.length === 0) {
    return (
      <div className="header-primary header-primary_empty">
        <img
          src={logo}
          alt={browser.i18n.getMessage('ext_name')}
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
        alt={browser.i18n.getMessage('ext_name')}
        className="header-primary__logo"
        aria-hidden={true}
      />

      {report.request.host ? (
        <Paragraph size="xs" className="header-primary__host">
          You loaded {report.request.host} from
        </Paragraph>
      ) : null}

      <Paragraph
        variant="handwriting"
        size="l"
        className="header-primary__country"
      >
        {report.countryName}
      </Paragraph>
    </div>
  );
};
