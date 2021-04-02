import { FC } from 'react';

import logo from './logo_icon.svg';
import text from './logo_text.svg';

import './logo.css';

export const Logo: FC = ({ children }) => {
  return (
    <div className="logo">
      <img
        src={logo}
        alt="Logo"
        className="logo__image"
        width="32px"
        height="32px"
      />
      <span className="logo__wrapper">
        <img
          src={text}
          alt="Capture The Flag"
          className="logo__text"
          width="140px"
          height="17px"
        />

        <span className="logo__aux">{children}</span>
      </span>
    </div>
  );
};
