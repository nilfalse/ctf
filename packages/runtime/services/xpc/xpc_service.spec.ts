import * as harness from '../../__test__/harness';
import { Report } from '../../lib/report';
import { Repository } from '../../lib/repository';
import { Request } from '../../lib/request';

import * as xpcBackgroundService from './xpc_background_service';
import * as xpcPopupService from './xpc_popup_service';

describe('XPC service', () => {
  describe('Background part', () => {
    describe('fetchReport', () => {
      const storageService = require('../storage/storage_service') as {
        reports: Repository<Report>;
      };
      const report = new Report(new Request({ url: 'fake' }));

      beforeEach(() => {
        storageService.reports.update(777, report);
      });

      afterEach(() => {
        storageService.reports.remove(777);
      });

      it('should fetch a report', () =>
        expect(
          xpcBackgroundService.handle({
            type: 'fetchReport',
            payload: 777,
          })
        ).resolves.toMatchObject({
          request: { url: 'fake' },
          traceroute: [],
        }));

      it('should serialize the report using toJSON()', () =>
        expect(
          xpcBackgroundService.handle({
            type: 'fetchReport',
            payload: 777,
          })
        ).resolves.toEqual(report.toJSON()));

      describe('when not found', () => {
        it('should return null', () =>
          expect(
            xpcBackgroundService.handle({
              type: 'fetchReport',
              payload: 666,
            })
          ).resolves.toBe(null));
      });
    });
  });

  describe('Popup part', () => {
    describe('fetchReport', () => {
      describe('when found', () => {
        harness.xpc.popup(
          Promise.resolve({
            request: { url: 'make' },
            traceroute: [],
          })
        );

        it('should return the report', () =>
          expect(
            xpcPopupService.dispatch('fetchReport', 777)
          ).resolves.toMatchObject({
            request: { url: 'make' },
            traceroute: [],
          }));

        it('should return a Report()', () =>
          expect(
            xpcPopupService.dispatch('fetchReport', 777)
          ).resolves.toBeInstanceOf(Report));
      });

      describe('when not found', () => {
        harness.xpc.popup(Promise.resolve(null));

        it('should return null', () =>
          expect(xpcPopupService.dispatch('fetchReport', 777)).resolves.toBe(
            null
          ));
      });
    });

    describe('unknownMessageType', () => {
      harness.xpc.popup(Promise.resolve(null));

      it('should not fail', () =>
        expect(
          xpcPopupService.dispatch('unknownMessageType', null)
        ).resolves.toEqual(null));
    });
  });
});
