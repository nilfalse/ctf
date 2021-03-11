import './app.css';

export function App() {
  return (
    <div className="app">
      <header className="app-header">
        <p>Capture The Flag</p>
        <small>Install extension:</small>

        <ul>
          <li>
            <a
              className="app-link"
              href="https://addons.mozilla.org/firefox/addon/ctf/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Firefox
            </a>
          </li>

          <li>
            <a
              className="app-link"
              href="https://chrome.google.com/webstore/detail/plmbleiamgcdnenigiocddjjgacgfgjb"
              target="_blank"
              rel="noopener noreferrer"
            >
              Chrome
            </a>
          </li>
        </ul>
      </header>
    </div>
  );
}
