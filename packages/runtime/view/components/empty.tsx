import { FC } from 'react';

import logo from '../../../../artwork/logo_text.svg';

import { Paragraph } from './typography';

import './empty.css';

export const Empty: FC = () => {
  return (
    <div className="empty">
      <div className="empty__header">
        <img
          src={logo}
          alt={browser.i18n.getMessage('ext_name')}
          className="empty__logo"
          aria-hidden={true}
        />

        <Paragraph size="s" className="empty__info">
          This tab didn't provide any information.
        </Paragraph>
      </div>

      <div className="empty__intro">
        <Paragraph variant="light" size="xs">
          It possibly uses a technology like ServiceWokers to reduce internet
          requests so we couldn't catch any.
        </Paragraph>
      </div>
    </div>
  );
};
