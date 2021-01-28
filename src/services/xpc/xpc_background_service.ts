import * as debug from '../../util/debug';
import * as storageService from '../storage/storage_service';

export async function handle(message: any) {
  switch (message.type) {
    case 'fetchReport':
      return fetchReport(message.payload);
    default:
      debug.never('Unexpected message type ' + message.type);
  }
}

function fetchReport(tabId: number) {
  return storageService.reports.fetch(tabId);
}
