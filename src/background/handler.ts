import { CountryRequest } from '../country_request';
import { render } from '../rendering';

export async function handleWebRequestCompleted(
  payload: chrome.webRequest.WebResponseCacheDetails
) {
  const { tabId } = payload;

  if (tabId === -1) {
    return; // skip extension popups
  }

  const request = new CountryRequest(payload);
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
        chrome.pageAction.setTitle({ tabId, title: countryName }, reportError);
      }
      chrome.pageAction.setPopup(
        { tabId, popup: 'popup.html?tab=' + tabId },
        reportError
      );
      chrome.pageAction.show(tabId, reportError);

      return;
    }
  }
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

function reportError() {
  if (chrome.runtime.lastError) {
    console.error(chrome.runtime.lastError);
  }
}
