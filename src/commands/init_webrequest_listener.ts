import { publish } from '../background/app';
import { CountryResponseCommand } from './country_response';

export class InitWebRequestListenerCommand {
  async execute() {
    chrome.webRequest.onCompleted.addListener(
      module.hot
        ? (res) => handleWebRequestCompleted(res)
        : handleWebRequestCompleted,
      {
        urls: ['<all_urls>'],
        types: ['main_frame'],
      },
      ['responseHeaders']
    );
  }
}

export function handleWebRequestCompleted(
  payload: chrome.webRequest.WebResponseCacheDetails
) {
  const { tabId } = payload;

  if (tabId === -1) {
    return; // skip extension popups
  }

  publish(new CountryResponseCommand(tabId, payload));
}
