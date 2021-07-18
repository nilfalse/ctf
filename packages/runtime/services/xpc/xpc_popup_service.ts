import { Report } from '../../lib/report';

const transformers = Object.assign(Object.create(null), {
  fetchReport(payload: Report | null): Report | null {
    return payload ? Report.fromJSON(payload) : payload;
  },
}) as Record<string, () => unknown>;

export function dispatch(
  type: 'fetchReport',
  payload: number
): Promise<Report | null>;
export function dispatch(type: string, payload: unknown): Promise<unknown>;
export function dispatch(type: string, payload?: unknown) {
  const promise = browser.runtime.sendMessage({
    type,
    payload,
  }) as Promise<unknown>;

  return type in transformers ? promise.then(transformers[type]) : promise;
}
