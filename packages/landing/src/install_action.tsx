import { useEffect, useState, FC } from 'react';

import { CallToAction } from './call-to-action';
import { firefoxDownloadURL, webstores } from './data';

function addToFirefox() {
  return (
    InstallTrigger as {
      install: (trigger: Record<string, unknown>) => boolean;
    }
  ).install({
    'Capture The Flag': firefoxDownloadURL,
  });
}

export const InstallAction: FC = () => {
  const [impl, setImpl] = useState<string | null>(null);

  useEffect(() => {
    const hasInstallTrigger = typeof InstallTrigger !== 'undefined';
    if (hasInstallTrigger) {
      setImpl('firefox');
    } else if (navigator.userAgent.includes('Chrome/')) {
      setImpl('chromium');
    }
  }, []);

  switch (impl) {
    case 'firefox':
      return (
        <CallToAction onClick={addToFirefox}>
          <span className="hero__cta-bold">Add to Firefox</span> It's free
        </CallToAction>
      );
    case 'chromium':
      return (
        <CallToAction href={webstores.google} target="_blank" rel="noopener">
          <span className="hero__cta-bold">Add to Chrome</span> It's free
        </CallToAction>
      );
    default:
      return (
        <CallToAction href="#download" rel="noopener">
          <span className="hero__cta-bold">Download</span> It's free
        </CallToAction>
      );
  }
};
