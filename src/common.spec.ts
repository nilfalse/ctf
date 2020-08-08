import * as common from './common';

describe('Common library', () => {
  describe('"is key of" utility', () => {
    it('should return true when key exists', () => {
      const dict = { A: 1, b: 2 };

      expect(common.isKeyof(dict, 'A')).toBeTruthy();
      expect(common.isKeyof(dict, 'b')).toBeTruthy();
    });

    it('should return false when key does not exist', () => {
      const dict = {};

      expect(common.isKeyof(dict, 'A')).toBeFalsy();
      expect(common.isKeyof(dict, 'b')).toBeFalsy();
    });
  });

  describe('"upper case lookup" utility', () => {
    it('should return null if key is not found', () => {
      const dict = {};

      expect(common.lookupUpperCase(dict, 'a')).toBeNull();
    });

    it('should return value by key if it is found', () => {
      const dict = { A: 1, B: 'hello' };

      expect(common.lookupUpperCase(dict, 'A')).toBe(1);
      expect(common.lookupUpperCase(dict, 'B')).toBe('hello');
    });

    it('should support returning non-primitive values', () => {
      const dict = {
        A: {
          B: 'hello',
        },
      };

      expect(common.lookupUpperCase(dict, 'a')).toStrictEqual({
        B: 'hello',
      });
    });

    it('should find the value if the given key is not strictly upper case', () => {
      const dict = { A: 1, BCD: 'hello' };

      expect(common.lookupUpperCase(dict, 'a')).toBe(1);
      expect(common.lookupUpperCase(dict, 'bCd')).toBe('hello');
    });
  });
});
