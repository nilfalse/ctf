import * as maxmind from 'maxmind';

import { guess } from './heuristics';
import * as GeoIp from './lib/geoip';
import * as emoji from './lib/emoji';
import { render } from './rendering';

interface InitParams {
  browser: typeof chrome;
  geoip: maxmind.Reader<maxmind.CountryResponse>;
}

async function main() {
  init({
    browser: chrome,
    geoip: await GeoIp.createReader(),
  });
}

export function init({ browser }: InitParams) {
  browser.webRequest.onCompleted.addListener(
    async function (res) {
      const rankedGuesses = await guess(res);
      console.log(res, rankedGuesses);

      for (const rankedGuess of rankedGuesses) {
        const flag = emoji.fromISOCountryCode(rankedGuess.isoCountry);
        if (flag) {
          chrome.pageAction.setIcon({
            tabId: res.tabId,
            imageData: await render(flag.emoji),
          });

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

  console.log('flags extension has been initialized');
}

if (!module.parent) {
  main();
}
