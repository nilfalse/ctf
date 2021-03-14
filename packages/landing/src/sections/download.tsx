import { FC } from 'react';

import { CallToAction } from '../call-to-action';
import { Container } from '../container';
import { webstores } from '../data';

import './download.css';

interface DownloadSectionProps {
  className?: string;
}

export const DownloadSection: FC<DownloadSectionProps> = ({ className }) => {
  const containerClassNames = ['download-section__container'];
  if (className) {
    containerClassNames.push(className);
  }

  return (
    <section id="download" className="download-section">
      <Container className={containerClassNames.join(' ')}>
        <h2 className="download-section__headline">
          Supported by your platform
        </h2>

        <ul className="download-section__list download-section__platforms">
          <li className="download-section__platform download-section__platform_firefox">
            <p className="download-section__text">
              <CallToAction
                variant="secondary"
                className="download-section__link"
                href={webstores.mozilla}
                target="_blank"
                rel="noopener noreferrer"
              >
                Firefox Browser Add-ons
              </CallToAction>
            </p>
            <p className="download-section__text">
              Install Add-on from Mozilla Add-ons
            </p>
          </li>

          <li className="download-section__platform download-section__platform_chromium">
            <p className="download-section__text">
              <CallToAction
                variant="secondary"
                className="download-section__link"
                href={webstores.google}
                target="_blank"
                rel="noopener noreferrer"
              >
                Chrome Web Store
              </CallToAction>
            </p>
            <ul className="download-section__list download-section__text">
              <li className="download-section__list-item">Google Chrome</li>
              <li className="download-section__list-item">Microsoft Edge</li>
              <li className="download-section__list-item">Opera</li>
              <li className="download-section__list-item">Brave</li>
              <li className="download-section__list-item">etc, you name it</li>
            </ul>
          </li>
        </ul>
      </Container>
    </section>
  );
};
