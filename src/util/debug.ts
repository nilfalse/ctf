export const intro =
  process.env.NODE_ENV === 'development'
    ? () => {
        console.log(
          '%c%s',
          'font-size: 21px; color: cyan; text-shadow: 1px 1px 0 black, 1px -1px 0 black, -1px 1px 0 black, -1px -1px 0 black',
          'Running in development mode.\nClick below to open the popup page:'
        );
        console.log(
          '%c%s',
          'font-size: 15px',
          chrome.runtime.getURL('popup.html')
        );
      }
    : () => {
        // ignore in test & production
      };

export const log = console.log.bind(globalThis);

export const error = console.error.bind(globalThis);

export const assert = console.assert.bind(globalThis);
