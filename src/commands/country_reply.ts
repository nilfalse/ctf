import { publish } from '../background/app';
import { Match } from '../heuristics';
import { CountryRequest, CountryRequestParams } from '../lib/country_request';

import { UpdatePayloadsRepoCommand } from './update_payloads_repo';

export class CountryReplyCommand {
  request: CountryRequest;

  constructor(public tabId: number, payload: CountryRequestParams) {
    this.tabId = tabId;
    this.request = new CountryRequest(payload);
  }

  execute() {
    publish(new UpdatePayloadsRepoCommand(this.tabId, this.request));

    return this._execute();
  }

  async _execute() {
    const { heuristics } = await import(
      /* webpackChunkName: "heuristics" */ '../heuristics'
    );

    const matches = await Promise.all<ReadonlyArray<Match>>(
      heuristics.map((interceptor) => interceptor.dispatch(this.request))
    );

    return matches
      .flatMap((match) => match)
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score);
  }
}
