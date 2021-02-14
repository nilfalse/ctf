import { Report } from '../../lib/report';

const transformers: Record<string, any> = Object.assign(Object.create(null), {
  fetchReport(payload: Report | null): Report | null {
    return payload ? Report.fromJSON(payload) : payload;
  },
});

export function dispatch(
  type: 'fetchReport',
  payload: number
): Promise<Report | null>;
export function dispatch(type: string, payload?: unknown) {
  const promise = browser.runtime.sendMessage({
    type,
    payload,
  });

  return type in transformers ? promise.then(transformers[type]) : promise;
}
