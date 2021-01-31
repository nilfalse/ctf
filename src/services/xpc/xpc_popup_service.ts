import { Report } from '../../lib/report';

const transformers: Record<string, any> = {
  fetchReport(payload: Report | null): Report | null {
    return payload ? Report.fromJSON(payload) : payload;
  },
};

export function dispatch(
  type: 'fetchReport',
  payload: number
): Promise<Report | null>;
export function dispatch(type: string, payload?: any) {
  const message = {
    type,
    payload,
  };

  return browser.runtime
    .sendMessage(message)
    .then((payload) =>
      type in transformers ? transformers[type](payload) : payload
    );
}
