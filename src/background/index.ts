import { CountryRequest } from '../country_request';
import { render } from '../rendering';

interface InitParams {
  browser: typeof chrome;
}

async function main() {
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

  init({
    browser: chrome,
  });
}

export function init({ browser }: InitParams) {
  browser.webRequest.onCompleted.addListener(
    async function (res) {
      const { tabId } = res;

      const request = new CountryRequest(res);
      const resolutions = await request.resolve();

      console.log(resolutions);
      for (const resolution of resolutions) {
        const flag = await getFlagEmoji(resolution.isoCountry);
        const countryName = await getCountryName(resolution.isoCountry);

        if (flag) {
          chrome.pageAction.setIcon(
            { tabId, imageData: await render(flag.emoji) },
            reportError
          );

          if (countryName) {
            chrome.pageAction.setTitle(
              { tabId, title: countryName },
              reportError
            );
          }
          chrome.pageAction.setPopup(
            { tabId, popup: 'popup.html?tab=' + tabId },
            reportError
          );
          chrome.pageAction.show(tabId, reportError);

          return;
        }
      }
    },
    {
      urls: ['<all_urls>'],
      types: ['main_frame'],
    },
    ['responseHeaders']
  );
}

function getFlagEmoji(code: string) {
  return import(
    /* webpackChunkName: "emoji" */ '../lib/emoji'
  ).then(({ fromISOCountryCode }) => fromISOCountryCode(code));
}

function getCountryName(code: string) {
  return import(
    /* webpackChunkName: "iso" */ '../lib/iso'
  ).then(({ getCountryName }) => getCountryName(code));
}

const reportError = () => {
  if (chrome.runtime.lastError) {
    console.error(chrome.runtime.lastError);
  }
};

if (!module.parent) {
  main();
}
