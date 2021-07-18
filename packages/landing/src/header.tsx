import { useEffect, useState, FC } from 'react';

import { Container } from './container';
import { Logo } from './logo';

import './header.css';

export const Header: FC = ({ children }) => {
  const classNames = ['header'];

  const [isShadowed, setShadow] = useState(false);

  useEffect(() => {
    const onScroll: EventListener = (_evt) => {
      setShadow(document.documentElement.scrollTop > 0);
    };
    window.addEventListener('scroll', onScroll);

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (isShadowed) {
    classNames.push('header_sticky');
  }

  return (
    <header className={classNames.join(' ')}>
      <Container className="header__container">
        <Logo>
          by{' '}
          <a href="/" className="header__home-link">
            nilfalse
          </a>
        </Logo>

        {children}
      </Container>
    </header>
  );
};
