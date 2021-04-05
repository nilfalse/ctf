import { FC } from 'react';

import { Container } from '../container';
import omniboxDemo from '../omnibox.svg';

import './promo.css';

interface PromoSectionProps {
  className?: string;
}

export const PromoSection: FC<PromoSectionProps> = ({ className }) => {
  return (
    <section className={`promo-section${className ? ` ${className}` : ''}`}>
      <Container>
        <div className="promo-section__omnidemo">
          <img
            src={omniboxDemo}
            alt="Browser omnibox extension demo"
            className="promo-section__omnibox"
          />
        </div>
        <p className="promo-section__headline">
          Capture The Flag — privacy-focused cloud insights.
        </p>
      </Container>
    </section>
  );
};
