import { Match } from '../heuristics';
import { CountryRequest, CountryRequestInit } from '../lib/country_request';

export class CountryResponseCommand {
  tabId: number;
  request: CountryRequest;

  constructor(tabId: number, payload: CountryRequestInit) {
    this.tabId = tabId;
    this.request = new CountryRequest(payload);
  }

  async execute() {
    const { heuristics } = await import('../heuristics');

    const matches = await Promise.all<ReadonlyArray<Match>>(
      heuristics.map((interceptor) => interceptor.dispatch(this.request))
    );

    return matches
      .flatMap((match) => match)
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score);
  }
}
