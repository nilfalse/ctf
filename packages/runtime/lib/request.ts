import { WebRequest } from 'webextension-polyfill-ts';

import * as dnsService from '../services/dns/dns_service';
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

  protected _headersByName: Map<string, string | undefined>;

  constructor({ url, ip, responseHeaders }: RequestParameters) {
    this.url = url || null;
    this.ip = ip || null;
    this.headers = responseHeaders;

    this._headersByName = responseHeaders
      ? new Map(
          responseHeaders.map(({ name, value }) => [name.toLowerCase(), value])
        )
      : new Map<string, string>();
  }

  get host() {
    return this.url ? getHost(this.url) : null;
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

  static async fromWebRequest(payload: RequestParameters) {
    if (!payload.ip) {
      // try to fixup the missing IP field in Firefox
      if (payload.url) {
        const host = getHost(payload.url);
        const ips = (await dnsService.offline(host)) as string[] | undefined[];

        debug.log(
          `Fixing up the missing IP for '${host}' with [${ips.join(', ')}]`
        );

        return new Request({
          ...payload,
          ip: ips[0],
        });
      }
    }

    return new Request(payload);
  }
}

function getHost(url: string) {
  const host = new URL(url).hostname;

  return host.startsWith('www.') ? host.substring(4) : host;
}
