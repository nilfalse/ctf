import type { Itinerary } from '../lib/itinerary/interfaces.ts';

import './popup.css';

interface Props {
  itinerary?: null | Itinerary;
  _?: (iso: TwoUppercaseLetters) => string;
}

export default function ({ itinerary, _ = String }: Props) {
  if (itinerary === undefined) {
    // prerendering
    return <main />;
  }

  if (itinerary === null) {
    return (
      <main>
        <p>No data for this page.</p>
      </main>
    );
  }

  return (
    <main>
      <h1>{itinerary.hostname}</h1>
      {itinerary.ip && <p>IP: {itinerary.ip}</p>}
      {itinerary.country && <p>Country: {_(itinerary.country)}</p>}
      {itinerary.server && <p>Server: {itinerary.server}</p>}
      {itinerary.powered && <p>Powered by: {itinerary.powered}</p>}

      {itinerary.hops.length ? (
        <ul>
          {itinerary.hops.map((hop, idx) => (
            <li key={idx}>
              {_(hop.country)}: {hop.cloud} {hop.pop}
              {hop.cacheStatus && ` (${hop.cacheStatus})`}
            </li>
          ))}
        </ul>
      ) : (
        <p>No CDN detected.</p>
      )}
    </main>
  );
}
