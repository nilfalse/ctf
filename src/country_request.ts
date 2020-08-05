import { heuristics, Resolutions } from './heuristics';

interface CountryRequestInit {
  url?: string;
  ip?: string;
  responseHeaders?: chrome.webRequest.HttpHeader[];
}

export class CountryRequest {
  url: string | null;
  ip: string | null;
  headers?: chrome.webRequest.HttpHeader[];

  protected _headersByName: Map<string, string>;

  constructor({ url, ip, responseHeaders }: CountryRequestInit) {
    this.url = url || null;
    this.ip = ip || null;
    this.headers = responseHeaders;

    this._headersByName = responseHeaders
      ? new Map(
          responseHeaders.map(({ name, value }) => [name.toLowerCase(), value])
        )
      : new Map();
  }

  getHeader(headerName: string) {
    console.assert(
      headerName.length > 0,
      'Empty header name requested in CountryRequest.getHeader'
    );

    return this._headersByName.get(headerName.toLowerCase()) || '';
  }

  async resolve() {
    const results = await Promise.all<Resolutions>(
      heuristics.map((heuristic) => heuristic.resolve(this))
    );

    const ranked = results
      .flatMap((match) => match)
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score);

    return ranked;
  }
}
