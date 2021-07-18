import { Tabs, WebRequest } from 'webextension-polyfill-ts';

import * as harness from '../__test__/harness';
import * as controllers from '../controllers';
import * as airportService from '../services/airport/airport_service';
import * as geoService from '../services/geo/geo_service';
import * as preferenceService from '../services/preference/preference_service';
import * as reportService from '../services/report/report_service';
import * as storageService from '../services/storage/storage_service';
import * as debug from '../util/debug';

jest.mock('../controllers');
jest.mock('../services/airport/airport_service');
jest.mock('../services/geo/geo_service');

jest.mock('../services/env/env_service', () => ({
  supportsActionSVG: true,
}));
jest.mock('../services/icon/icon_service', () => {
  const original = jest.requireActual<{
    defaultIconPromise: Promise<unknown>;
  }>('../services/icon/icon_service');
  return {
    ...original,
    defaultIconPromise: Promise.resolve({ path: 'DEFAULT_ICON' }),
  };
});

describe('Background script', () => {
  describe('entrypoint', () => {
    it('should print the debug introduction', () => {
      const spy = jest.spyOn(debug, 'intro');

      void require('./background');

      expect(spy).toHaveBeenCalledTimes(1);
      spy.mockRestore();
    });

    it('should kick off controllers', () => {
      void require('./background');

      expect(controllers.start).toHaveBeenCalledTimes(1);
    });
  });

  describe('controllers', () => {
    beforeAll(geoService.init);
    beforeAll(airportService.init);

    const browser = harness.browser.stub();
    harness.browser.storage({ render: 'twemoji' });

    beforeEach(
      jest.requireActual<{
        start: () => Promise<void>;
      }>('../controllers').start
    );

    it('should subscribe to network requests', () => {
      expect(
        browser.webRequest.onResponseStarted.addListener
      ).toHaveBeenCalledTimes(1);

      expect(browser.webRequest.onResponseStarted.addListener).lastCalledWith(
        expect.any(Function),
        {
          urls: ['<all_urls>'],
          types: ['main_frame'],
        },
        ['responseHeaders']
      );
    });

    it('should subscribe to tab change events', () => {
      expect(browser.tabs.onUpdated.addListener).toHaveBeenCalledTimes(1);

      expect(browser.tabs.onUpdated.addListener).lastCalledWith(
        expect.any(Function)
      );
    });

    it('should subscribe to tab close events', () => {
      expect(browser.tabs.onRemoved.addListener).toHaveBeenCalledTimes(1);

      expect(browser.tabs.onRemoved.addListener).lastCalledWith(
        expect.any(Function)
      );
    });

    it('should subscribe to popup messages', () => {
      expect(browser.runtime.onMessage.addListener).toHaveBeenCalledTimes(1);

      expect(browser.runtime.onMessage.addListener).lastCalledWith(
        expect.any(Function)
      );
    });

    it('should subscribe preference service to storage updates', () =>
      expect(browser.storage.onChanged.addListener).toHaveBeenCalledWith(
        preferenceService.refresh
      ));

    describe('when response headers become available', () => {
      let responseStartedCallback: (
        details: WebRequest.OnResponseStartedDetailsType
      ) => Promise<void> | void;

      harness.browser.i18n();
      harness.browser.pageAction();

      beforeEach(() => {
        const responseStartedSpy = jest.spyOn(
          browser.webRequest.onResponseStarted,
          'addListener'
        );
        responseStartedCallback = responseStartedSpy.mock.calls[0][0];
      });

      describe('report service', () => {
        beforeEach(() => {
          jest.spyOn(reportService, 'collect');
        });

        afterEach(() => jest.spyOn(reportService, 'collect').mockRestore());

        it('should not receive Web Requests that belong to hidden tabs', async () => {
          await responseStartedCallback({
            tabId: browser.tabs.TAB_ID_NONE,
          } as WebRequest.OnResponseStartedDetailsType);

          expect(reportService.collect).not.toHaveBeenCalled();
          expect(
            storageService.reports.fetch(browser.tabs.TAB_ID_NONE)
          ).toBeNull();
        });

        it('should examine the Web Request', async () => {
          const payload = {
            tabId: 99,
            ip: '195.64.225.67',
          } as WebRequest.OnResponseStartedDetailsType;
          await responseStartedCallback(payload);

          expect(reportService.collect).toHaveBeenCalledWith(payload);
          expect(storageService.reports.fetch(99)).toMatchObject({
            iso: 'UA',
            countryName: 'Ukraine',
            traceroute: [
              {
                continent: 'EU',
                extra: { registeredCountry: 'UA' },
                heuristic: 'ip',
                isoCountry: 'UA',
                isoRegion: null,
                score: 0.5,
              },
            ],
          });
          expect(reportService.collect).toHaveBeenCalledTimes(1);

          storageService.reports.remove(99);
        });
      });

      describe('page action', () => {
        describe('on tab activation', () => {
          describe('for a tab that has a report', () => {
            const tabId = 111;
            prepareTabActivated(tabId, {
              ip: '195.64.224.66',
            });

            it('should update title from the report', () =>
              expect(browser.pageAction.setTitle).toHaveBeenCalledWith({
                tabId,
                title: 'Capture The Flag:\nUkraine',
              }));

            it('should update popup from the report', () =>
              expect(browser.pageAction.setPopup).toHaveBeenCalledWith({
                tabId,
                popup: `popup.html?tab=${tabId}`,
              }));

            it('should update icon from the report', () =>
              expect(browser.pageAction.setIcon).toHaveBeenCalledWith({
                tabId,
                path: '/assets/twemoji/ua.svg',
              }));

            it('should call .show()', () =>
              expect(browser.pageAction.show).toHaveBeenCalledWith(tabId));
          });

          describe('for a tab that has no report', () => {
            const tabId = 112;
            prepareTabActivated(tabId);

            it('should not change title', () =>
              expect(browser.pageAction.setTitle).not.toHaveBeenCalled());

            it('should set appropriate popup', () =>
              expect(browser.pageAction.setPopup).toHaveBeenCalledWith({
                tabId,
                popup: `popup.html?tab=${tabId}`,
              }));

            it('should set the default icon', () =>
              expect(browser.pageAction.setIcon).toHaveBeenCalledWith({
                tabId,
                path: 'DEFAULT_ICON',
              }));

            it('should call .show()', () =>
              expect(browser.pageAction.show).toHaveBeenCalledWith(tabId));
          });
        });

        describe('on tab update', () => {
          describe('while it is still loading', () => {
            const tabId = 113;
            prepareTabUpdate(tabId);

            it('should update title from the report', () =>
              expect(browser.pageAction.setTitle).toHaveBeenCalledWith({
                tabId,
                title: 'Capture The Flag:\nUkraine',
              }));

            it('should update popup from the report', () =>
              expect(browser.pageAction.setPopup).toHaveBeenCalledWith({
                tabId,
                popup: `popup.html?tab=${tabId}`,
              }));

            it('should update icon from the report', () =>
              expect(browser.pageAction.setIcon).toHaveBeenCalledWith({
                tabId,
                path: '/assets/twemoji/ua.svg',
              }));

            it('should call .show()', () =>
              expect(browser.pageAction.show).toHaveBeenCalledWith(tabId));
          });

          describe('after it is ready', () => {
            const tabId = 114;
            prepareTabUpdate(tabId, 'complete');

            it('should not change title', () =>
              expect(browser.pageAction.setTitle).not.toHaveBeenCalled());

            it('should not change popup', () =>
              expect(browser.pageAction.setPopup).not.toHaveBeenCalled());

            it('should not change icon', () =>
              expect(browser.pageAction.setIcon).not.toHaveBeenCalled());

            it('should not call .show()', () =>
              expect(browser.pageAction.show).not.toHaveBeenCalled());
          });
        });

        describe('on tab removed', () => {
          const tabId = 115;

          beforeEach(async () => {
            const tabRemovedCallback = jest.spyOn(
              browser.tabs.onRemoved,
              'addListener'
            ).mock.calls[0][0];

            storageService.reports.update(
              tabId,
              await reportService.collect({})
            );

            jest.spyOn(storageService.reports, 'remove');
            // eslint-disable-next-line @typescript-eslint/await-thenable
            await tabRemovedCallback(tabId, {} as Tabs.OnRemovedRemoveInfoType);
          });

          it('should cleanup the reports repository', () => {
            expect(storageService.reports.remove).toHaveBeenCalledWith(tabId);
            expect(storageService.reports.remove).toHaveBeenCalledTimes(1);
          });
        });
      });
    });
  });
});

function prepareTabActivated(tabId: number, payload?: Record<string, unknown>) {
  beforeEach(async () => {
    const tabActivatedCallback = jest.spyOn(
      browser.tabs.onActivated,
      'addListener'
    ).mock.calls[0][0];

    if (payload) {
      storageService.reports.update(
        tabId,
        await reportService.collect(payload)
      );
    }

    // eslint-disable-next-line @typescript-eslint/await-thenable
    await tabActivatedCallback({
      tabId,
    } as Tabs.OnActivatedActiveInfoType);
  });

  afterEach(() => {
    storageService.reports.remove(tabId);
  });
}

function prepareTabUpdate(tabId: number, status = 'loading') {
  beforeEach(async () => {
    const tabUpdatedCallback = jest.spyOn(browser.tabs.onUpdated, 'addListener')
      .mock.calls[0][0];

    storageService.reports.update(
      tabId,
      await reportService.collect({
        ip: '195.64.224.65',
      })
    );

    // eslint-disable-next-line @typescript-eslint/await-thenable
    await tabUpdatedCallback(
      tabId,
      { status } as Tabs.OnUpdatedChangeInfoType,
      null as unknown as Tabs.Tab
    );
  });

  afterEach(() => {
    storageService.reports.remove(tabId);
  });
}
