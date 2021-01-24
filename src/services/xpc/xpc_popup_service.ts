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
  return new Promise((resolve, reject) => {
    const message = {
      type,
      payload,
    };

    chrome.runtime.sendMessage(message, (payload: any) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(type in transformers ? transformers[type](payload) : payload);
      }
    });
  });
}
