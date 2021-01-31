import { Runtime } from 'webextension-polyfill-ts';

import * as harness from '../../__test__/harness';

import * as preferencesService from './preference_service';

describe('Preferences service', () => {
  describe('when initializing', () => {
    harness.browser.storage({
      render: 'hello',
      fake: 'lol',
    });

    beforeEach(preferencesService.init);

    it('should fetch only known preferences from sync', () => {
      expect(browser.storage.sync.get).toHaveBeenCalledWith(['render']);
      expect(browser.storage.sync.get).toHaveBeenCalledTimes(1);
    });

    it('should override the default preferences with values from sync', () =>
      expect(preferencesService.getValue('render')).toBe('hello'));
  });

  describe('when ready', () => {
    describe('for an unknown preference', () => {
      harness.browser.storage();

      beforeEach(preferencesService.init);

      it('should throw an error', () =>
        expect(() => preferencesService.getValue('lol')).toThrow(
          'Cannot retrieve unexpected "lol" preference'
        ));
    });

    describe('for a known preference', () => {
      describe('"render"', () => {
        describe('by default', () => {
          describe('on mac', () => {
            harness.browser.storage();

            beforeEach(() =>
              jest
                .spyOn(browser.runtime, 'getPlatformInfo')
                .mockResolvedValue({ os: 'mac' } as Runtime.PlatformInfo)
            );

            beforeEach(preferencesService.init);

            it('should return "emoji"', () =>
              expect(preferencesService.getValue('render')).toBe('emoji'));
          });

          describe('on other systems', () => {
            harness.browser.storage();

            beforeEach(preferencesService.init);

            it('should return "twemoji"', () =>
              expect(preferencesService.getValue('render')).toBe('twemoji'));
          });
        });

        describe('with sync value set to "sync"', () => {
          harness.browser.storage({
            render: 'sync',
          });

          beforeEach(preferencesService.init);

          it('should return "sync"', () =>
            expect(preferencesService.getValue('render')).toBe('sync'));
        });
      });
    });
  });

  describe('when setting', () => {
    harness.browser.storage();

    beforeEach(preferencesService.init);

    it('should propagate the new value to sync', async () => {
      const newPrefs = { render: 'set' };
      await preferencesService.set(newPrefs);

      expect(browser.storage.sync.set).toHaveBeenCalledWith(newPrefs);
    });

    describe('when sync fails', () => {
      it('should throw the error', () => {
        jest
          .spyOn(browser.storage.sync, 'set')
          .mockRejectedValueOnce(new Error('Hello Kitty'));

        return expect(
          preferencesService.set({ render: 'kitty' })
        ).rejects.toThrow(new Error('Hello Kitty'));
      });
    });

    describe('unknown preferences', () => {
      it('should throw an error', () =>
        expect(preferencesService.set({ toString: 'set' })).rejects.toThrow(
          'Cannot set an unexpected "toString" preference'
        ));
    });
  });

  describe('when refreshing', () => {
    harness.browser.storage();

    beforeEach(preferencesService.init);

    it('should ignore non-sync updates', () => {
      preferencesService.refresh(
        {
          render: { newValue: 'refreshed' },
        },
        'local'
      );

      expect(preferencesService.getValue('render')).toBe('twemoji');
    });
  });

  describe('after refreshing', () => {
    harness.browser.storage();

    beforeEach(preferencesService.init);

    it('should return the updated value', () => {
      preferencesService.refresh(
        {
          render: { newValue: 'refreshed' },
        },
        'sync'
      );

      expect(preferencesService.getValue('render')).toBe('refreshed');
    });
  });
});
