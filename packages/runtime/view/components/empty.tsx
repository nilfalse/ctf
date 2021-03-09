import { FC } from 'react';

import { Logo, LogoText } from './logo';
import { Paragraph } from './typography';

import './empty.css';

export const Empty: FC = () => {
  return (
    <div className="empty">
      <div className="empty__header">
        <Logo color="light" className="header-primary__icon" />
        <LogoText className="empty__logo header-primary__logo" />

        <Paragraph size="s" className="empty__info">
          We could not capture anything on this tab.
        </Paragraph>
      </div>

      <div className="empty__intro">
        <Paragraph variant="light" size="xs">
          No requests seem to have been made on this tab.
        </Paragraph>
        <Paragraph variant="light" size="xs">
          This could be, for example, due to the tab using ServiceWokers
          technology which reduces internet traffic.
        </Paragraph>
      </div>
    </div>
  );
};
