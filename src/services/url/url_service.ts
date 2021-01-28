export function getHost(url: string) {
  const host = new URL(url).hostname;

  return host.startsWith('www.') ? host.substring(4) : host;
}
