import { WebRequest } from 'webextension-polyfill-ts';

import * as debug from '../util/debug';

export interface RequestParameters {
  url?: string;
  ip?: string;
  responseHeaders?: WebRequest.HttpHeaders;
}

export class Request {
  url: string | null;
  ip: string | null;
  headers?: WebRequest.HttpHeaders;

  protected _headersByName: Map<string, string>;

  constructor({ url, ip, responseHeaders }: RequestParameters) {
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
      'Empty header name requested in Request.getHeader'
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

  static fromJSON(json: Request) {
    return new Request({
      url: json.url || undefined,
      ip: json.ip || undefined,
      responseHeaders: json.headers,
    });
  }
}
