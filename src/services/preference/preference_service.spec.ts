import * as preferencesService from './preference_service';

describe('Preferences service', () => {
  describe('for the rendering preference', () => {
    it('should return "emoji"', () =>
      expect(preferencesService.getValue('render')).toBe('emoji'));
  });

  describe('for an unknown preference', () => {
    it('should throw an error', () =>
      expect(() => preferencesService.getValue('lol')).toThrow(
        new Error('Unexpected preference name lol')
      ));
  });
});
