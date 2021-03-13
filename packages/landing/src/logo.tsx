import { FC } from 'react';

import logo from './logo_icon.svg';
import text from './logo_text.svg';

import './logo.css';

export const Logo: FC = ({ children }) => {
  return (
    <div className="logo">
      <img src={logo} alt="Logo" className="logo__image" />
      <span className="logo__wrapper">
        <img src={text} alt="Capture The Flag" className="logo__text" />

        <span className="logo__aux">{children}</span>
      </span>
    </div>
  );
};
