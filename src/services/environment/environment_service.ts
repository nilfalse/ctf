export function getPlatform() {
  return new Promise<chrome.runtime.PlatformInfo>((resolve) => {
    chrome.runtime.getPlatformInfo(resolve);
  });
}
