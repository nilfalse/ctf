import { FC } from 'react';

import { Report } from '../../lib/report';

import { Logo, LogoText } from './logo';
import { Paragraph } from './typography';

import './header_primary.css';

interface HeaderPrimaryProps {
  report: Report;
}

export const HeaderPrimary: FC<HeaderPrimaryProps> = ({ report }) => {
  if (report.isEmpty) {
    return (
      <div className="header-primary header-primary_empty">
        <Logo color="light" className="header-primary__icon" />
        <LogoText className="header-primary__logo" />

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
      <LogoText className="header-primary__logo" />

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
