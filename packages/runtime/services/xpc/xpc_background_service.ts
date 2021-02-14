import * as debug from '../../util/debug';
import * as storageService from '../storage/storage_service';

export function handle(message: any) {
  switch (message.type) {
    case 'fetchReport':
      return fetchReport(message.payload);
    default:
      debug.never('Unexpected message type ' + message.type);
  }
}

function fetchReport(tabId: number) {
  const report = storageService.reports.fetch(tabId);

  return Promise.resolve(report ? report.toJSON() : null);
}
