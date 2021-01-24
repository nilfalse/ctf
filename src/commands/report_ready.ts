import { CountryRequest, CountryRequestParams } from '../lib/country_request';
import { Report } from '../lib/report';

export class ReportReadyCommand {
  request: CountryRequest;
  public report: Report;

  constructor(public tabId: number, payload: CountryRequestParams) {
    this.tabId = tabId;
    this.request = new CountryRequest(payload);
    this.report = null;
  }

  async execute() {
    const interceptors = await import(
      /* webpackChunkName: "interceptors" */ '../interceptors'
    );

    this.report = new Report(
      this.request,
      await interceptors.run(this.request)
    );

    return this.report.icons;
  }
}
