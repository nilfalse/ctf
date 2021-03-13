import { FC } from 'react';

import { Container } from '../container';
import amazon from '../icons/amazon.svg';
import cloudflare from '../icons/cloudflare.svg';
import fastly from '../icons/fastly.svg';

import './features.css';

interface FeaturesSectionProps {
  className?: string;
}

export const FeaturesSection: FC<FeaturesSectionProps> = ({ className }) => {
  const containerClassNames = ['features-section__container'];
  if (className) {
    containerClassNames.push(className);
  }

  return (
    <section className="features-section">
      <Container className={containerClassNames.join(' ')}>
        <h2 className="features-section__headline">
          Works with major cloud providers
        </h2>
        <div className="features-section__networks">
          <img
            src={cloudflare}
            alt="Cloudflare Logo"
            width="180px"
            height="114px"
            className="features-section__network"
          />
          <img
            src={amazon}
            alt="Amazon Logo"
            width="100px"
            height="62px"
            className="features-section__network"
          />
          <img
            src={fastly}
            alt="Fastly Logo"
            width="100px"
            height="75px"
            className="features-section__network"
          />
        </div>
        <p className="features-section__text features-section__text_insignificant">
          * support for Amazon&nbsp;CloudFront and Fastly is expected soon
        </p>
      </Container>
    </section>
  );
};
