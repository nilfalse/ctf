import * as maxmind from 'maxmind';

import * as GeoIp from './lib/geoip';
import * as cloudflare from './cloudflare';

interface IInit {
  browser: typeof chrome;
  geoip: maxmind.Reader<maxmind.CountryResponse>;
}

async function main() {
  init({
    browser: chrome,
    geoip: await GeoIp.createReader(),
  });
}

export function init({ browser, geoip }: IInit) {
  browser.webRequest.onCompleted.addListener(
    async function (res) {
      let info = null;

      if (res.ip) {
        info = res.ip;

        const countryResponse = geoip.get(res.ip);
        if (countryResponse) {
          if (countryResponse.country) {
            info += ' ' + countryResponse.country.iso_code;
          } else if (countryResponse.registered_country) {
            info += ' ' + countryResponse.registered_country.iso_code;
          }
        }
      }

      const airport = await cloudflare.parse(res);
      if (airport && airport.iso_country) {
        info += ` [Cloudflare: ${airport.iso_country}]`;
      }

      console.log(
        res.url + (info ? ' -- ' + info : ' // no extra information available')
      );
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
