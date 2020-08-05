import * as maxmind from 'maxmind';

import { CountryRequest } from './country_request';
import * as emoji from './lib/emoji';
import * as GeoIp from './lib/geoip';
import * as ISO from './lib/iso';
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
      const request = new CountryRequest(res);
      const resolutions = await request.resolve();

      console.log(resolutions);
      for (const resolution of resolutions) {
        const flag = emoji.fromISOCountryCode(resolution.isoCountry);
        const countryName = ISO.getCountryName(resolution.isoCountry);

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
