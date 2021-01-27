import * as harness from '../../__test__/harness';

import * as preferencesService from './preference_service';

describe('Preferences service', () => {
  describe('when initializing', () => {
    harness.browser.storage({
      render: 'nothing',
      fake: 'lol',
    });

    beforeEach(preferencesService.init);

    it('should fetch only known preferences from sync', () => {
      expect(chrome.storage.sync.get).toHaveBeenCalledWith(
        ['render'],
        expect.any(Function)
      );
      expect(chrome.storage.sync.get).toHaveBeenCalledTimes(1);
    });

    it('should override the default preferences with values from sync', () =>
      expect(preferencesService.getValue('render')).toBe('nothing'));
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
          harness.browser.storage();

          beforeEach(preferencesService.init);

          it('should return "emoji"', () =>
            expect(preferencesService.getValue('render')).toBe('emoji'));
        });

        describe('with sync value set to "twemoji"', () => {
          harness.browser.storage({
            render: 'twemoji',
          });

          beforeEach(preferencesService.init);

          it('should return "twemoji"', () =>
            expect(preferencesService.getValue('render')).toBe('twemoji'));
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

      expect(chrome.storage.sync.set).toHaveBeenCalledWith(
        newPrefs,
        expect.any(Function)
      );
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

      expect(preferencesService.getValue('render')).toBe('emoji');
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
