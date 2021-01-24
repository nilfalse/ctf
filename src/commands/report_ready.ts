import { Report } from '../lib/report';
import { Request, RequestParameters } from '../lib/request';

export class ReportReadyCommand {
  request: Request;
  report: Report;

  constructor(public tabId: number, payload: RequestParameters) {
    this.tabId = tabId;
    this.request = new Request(payload);
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
