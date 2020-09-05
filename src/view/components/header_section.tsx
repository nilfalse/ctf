import * as React from 'react';

import { Match } from '../../heuristics';

import './header_section.css';

interface HeaderSectionProps {
  matches: ReadonlyArray<Match>;
}

export const HeaderSection: React.FC<HeaderSectionProps> = ({ matches }) => {
  if (matches.length === 0) {
    return <div className="header-section header-section_empty"></div>;
  }

  const country = chrome.i18n.getMessage(
    'country_name_' + matches[0].isoCountry
  );

  return (
    <div className="header-section primary">
      <h1 className="header-section__country font_light">{country}</h1>
    </div>
  );
};
