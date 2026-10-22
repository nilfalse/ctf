import { StrictMode, useSyncExternalStore } from 'react';
import { hydrateRoot } from 'react-dom/client';

import * as country from '~/lib/country.ts';
import * as itinerary from '~/lib/itinerary/codec.ts';

import Popup from './Popup.tsx';

hydrateRoot(
  document.body,

  <StrictMode>
    <App />
  </StrictMode>,
);

function App() {
  const search = useSyncExternalStore(
    subscribe,
    () => location.search,
    () => null,
  );

  if (search === null) {
    return <Popup />;
  } else {
    return (
      <Popup itinerary={itinerary.fromSearchParams(search)} _={country.name} />
    );
  }
}

function subscribe() {
  return function () {};
}
