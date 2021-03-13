import { FC } from 'react';

import { CallToAction } from '../call-to-action';
import { Container } from '../container';
import popup from '../popup.png';

import './hero.css';

interface HeroProps {
  className?: string;
}

export const Hero: FC<HeroProps> = ({ className }) => {
  const containerClassNames = ['hero__container'];
  if (className) {
    containerClassNames.push(className);
  }

  return (
    <section className="hero">
      <Container className={containerClassNames.join(' ')}>
        <div className="hero__split">
          <div className="hero__intro">
            <h1 className="hero__headline">Accessible Web Insights</h1>

            <p className="hero__p">
              There is no such thing as “the cloud,” it’s just somebody else’s
              computer.
            </p>
            <p className="hero__p">
              Get to really know who you share your data with.
            </p>

            <div className="hero__cta-wrapper">
              <CallToAction href="#download">
                <span className="hero__cta-bold">Download</span> It's free
              </CallToAction>
            </div>
            <p className="hero__insignificant">
              Available for Firefox &amp; Chromium-based web browsers.
            </p>
          </div>
        </div>

        <div className="hero__split">
          <div className="hero__popup-container">
            <div className="hero__decoration hero__decoration1" />
            <div className="hero__decoration hero__decoration2" />
            <img
              src={popup}
              alt="Extension Popup Demo"
              width="360px"
              height="463px"
              className="hero__popup-demo"
            />
          </div>
        </div>
      </Container>
    </section>
  );
};
