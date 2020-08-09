import { start } from './main';

if (process.env.NODE_ENV === 'development') {
  console.log(
    '%c%s',
    'font-size: 21px; color: cyan; text-shadow: 1px 1px 0 black, 1px -1px 0 black, -1px 1px 0 black, -1px -1px 0 black',
    'Running in development mode.\nClick below to open the popup page:'
  );
  console.log(
    '%c%s',
    'font-size: 15px',
    `chrome-extension://${chrome.runtime.id}/popup.html\n`
  );
}

start({
  browser: chrome,
});
