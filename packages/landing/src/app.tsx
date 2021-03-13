import { CallToAction } from './call-to-action';
import { Header } from './header';
import { DownloadSection } from './sections/download';
import { FeaturesSection } from './sections/features';
import { Hero } from './sections/hero';
import { PromoSection } from './sections/promo';

import './app.css';

export function App() {
  return (
    <div className="app">
      <Header>
        <CallToAction href="#download" className="app__download">
          Download
        </CallToAction>
      </Header>

      <Hero className="app__section" />

      <FeaturesSection className="app__section" />

      <PromoSection className="app__section" />

      <DownloadSection className="app__section" />
    </div>
  );
}
