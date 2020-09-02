import * as debug from '../debug';

export interface CountryRequestInit {
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
    debug.assert(
      headerName.length > 0,
      'Empty header name requested in CountryRequest.getHeader'
    );

    return this._headersByName.get(headerName.toLowerCase()) || '';
  }

  toJSON() {
    return {
      url: this.url,
      ip: this.ip,
      headers: this.headers,
    };
  }

  static fromJSON(json: CountryRequest) {
    return new CountryRequest({
      url: json.url || undefined,
      ip: json.ip || undefined,
      responseHeaders: json.headers,
    });
  }
}
