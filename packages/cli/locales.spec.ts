import fs from 'fs';

import * as config from './locales.config.js';
import * as script from './locales.js';

jest.createMockFromModule('fs');
jest.mock('./locales.config');

describe('Locales Script', () => {
  const readSpy = jest.spyOn(fs.promises, 'readFile');
  const writeSpy = jest.spyOn(fs.promises, 'writeFile');

  beforeEach(() => {
    jest.resetModules();
    jest.resetAllMocks();
  });

  describe('for several locales', () => {
    beforeEach(() => {
      config.LOCALES = ['en', 'es'];
    });

    it('should load and update all relevant files', async () => {
      jest.mock('i18n-iso-countries/langs/en.json', () => ({
        countries: { DK: 'Denmark' },
      }));
      jest.mock('i18n-iso-countries/langs/es.json', () => ({
        countries: { DK: 'Dinamarca' },
      }));

      readSpy.mockResolvedValue('{}');

      await script.main(
        '/home/user/fakeRoot/bin',
        '/home/user/fakeRoot/packages/bundle/_locales'
      );

      expect(readSpy).toHaveBeenCalledTimes(2);
      expect(writeSpy).toHaveBeenCalledTimes(2);

      expect(writeSpy.mock.calls[0][0]).toBe(
        '/home/user/fakeRoot/packages/bundle/_locales/en/messages.json'
      );
      expect(JSON.parse(writeSpy.mock.calls[0][1] as string))
        .toMatchInlineSnapshot(`
        Object {
          "country_name_DK": Object {
            "message": "Denmark",
          },
        }
      `);

      expect(writeSpy.mock.calls[1][0]).toBe(
        '/home/user/fakeRoot/packages/bundle/_locales/es/messages.json'
      );
      expect(JSON.parse(writeSpy.mock.calls[1][1] as string))
        .toMatchInlineSnapshot(`
        Object {
          "country_name_DK": Object {
            "message": "Dinamarca",
          },
        }
      `);
    });
  });

  describe('for each locale', () => {
    beforeEach(() => {
      config.LOCALES = ['en'];
    });

    it('should not try to save if content would remain the same', async () => {
      jest.mock('i18n-iso-countries/langs/en.json', () => ({
        countries: {
          DK: 'Denmark',
          US: ['USA', 'United States'],
        },
      }));

      readSpy.mockResolvedValue(`{
  "country_name_DK": {
    "message": "Denmark"
  },
  "country_name_US": {
    "message": "USA"
  },
  "unrelated": {
    "description": "Some description",
    "message": "Some message"
  }
}
`);

      await script.main(
        '/home/user/fakeRoot/bin',
        '/home/user/fakeRoot/packages/bundle/_locales'
      );

      expect(readSpy).toHaveBeenCalled();
      expect(writeSpy).not.toHaveBeenCalled();
    });

    it('should remove the no longer available country translations', async () => {
      jest.mock('i18n-iso-countries/langs/en.json', () => ({
        countries: { DK: 'Denmark' },
      }));

      readSpy.mockResolvedValue(
        JSON.stringify({
          country_name_DK: { message: 'Denmark' },
          country_name_US: { message: 'USA' },
          unrelated: {
            description: 'Some description',
            message: 'Some message',
          },
        })
      );

      await script.main(
        '/home/user/fakeRoot/bin',
        '/home/user/fakeRoot/packages/bundle/_locales'
      );

      expect(writeSpy).toHaveBeenCalledTimes(1);
      expect(JSON.parse(writeSpy.mock.calls[0][1] as string)).toStrictEqual({
        country_name_DK: { message: 'Denmark' },
        unrelated: { description: 'Some description', message: 'Some message' },
      });
    });

    it('should preserve unrelated keys in the file', async () => {
      jest.mock('i18n-iso-countries/langs/en.json', () => ({
        countries: {
          DK: 'Denmark',
          US: ['United States of America', 'USA'],
        },
      }));

      readSpy.mockResolvedValue(
        JSON.stringify({
          unrelated: {
            description: 'Some description',
            message: 'Some message',
          },
        })
      );

      await script.main(
        '/home/user/fakeRoot/bin',
        '/home/user/fakeRoot/packages/bundle/_locales'
      );

      expect(writeSpy).toHaveBeenCalledTimes(1);
      expect(JSON.parse(writeSpy.mock.calls[0][1] as string)).toStrictEqual({
        country_name_DK: { message: 'Denmark' },
        country_name_US: { message: 'United States of America' },
        unrelated: { description: 'Some description', message: 'Some message' },
      });
    });

    it(`should use country's first name variation when more than one option is present`, async () => {
      jest.mock('i18n-iso-countries/langs/en.json', () => ({
        countries: {
          GB: ['United Kingdom', 'UK'],
          US: ['United States of America', 'USA'],
        },
      }));

      readSpy.mockResolvedValue(`{}`);

      await script.main(
        '/home/user/fakeRoot/bin',
        '/home/user/fakeRoot/packages/bundle/_locales'
      );

      expect(writeSpy).toHaveBeenCalledTimes(1);
      expect(JSON.parse(writeSpy.mock.calls[0][1] as string)).toStrictEqual({
        country_name_GB: { message: 'United Kingdom' },
        country_name_US: { message: 'United States of America' },
      });
    });

    it(`should use only part of the name before comma`, async () => {
      jest.mock('i18n-iso-countries/langs/en.json', () => ({
        countries: {
          MD: 'Moldova, Republic of',
        },
      }));

      readSpy.mockResolvedValue(`{}`);

      await script.main(
        '/home/user/fakeRoot/bin',
        '/home/user/fakeRoot/packages/bundle/_locales'
      );

      expect(writeSpy).toHaveBeenCalledTimes(1);
      expect(JSON.parse(writeSpy.mock.calls[0][1] as string)).toStrictEqual({
        country_name_MD: { message: 'Moldova' },
      });
    });

    it(`should special-case Virgin Islands`, async () => {
      jest.mock('i18n-iso-countries/langs/en.json', () => ({
        countries: {
          VG: 'Virgin Islands, British',
          VI: 'Virgin Islands, U.S.',
        },
      }));

      readSpy.mockResolvedValue(`{}`);

      await script.main(
        '/home/user/fakeRoot/bin',
        '/home/user/fakeRoot/packages/bundle/_locales'
      );

      expect(writeSpy).toHaveBeenCalledTimes(1);
      expect(JSON.parse(writeSpy.mock.calls[0][1] as string)).toStrictEqual({
        country_name_VG: { message: 'British Virgin Islands' },
        country_name_VI: { message: 'U.S. Virgin Islands' },
      });
    });

    it('should sort keys in the output file and pretty-print', async () => {
      jest.mock('i18n-iso-countries/langs/en.json', () => ({
        countries: { DK: 'Denmark' },
      }));

      readSpy.mockResolvedValue(`{
  "unrelated": {
    "message": "Some message",
    "description": "Some description"
  }
}
`);

      await script.main(
        '/home/user/fakeRoot/bin',
        '/home/user/fakeRoot/packages/bundle/_locales'
      );

      expect(writeSpy).toHaveBeenCalledTimes(1);
      expect(writeSpy.mock.calls[0][1]).toMatchInlineSnapshot(`
              "{
                \\"country_name_DK\\": {
                  \\"message\\": \\"Denmark\\"
                },
                \\"unrelated\\": {
                  \\"description\\": \\"Some description\\",
                  \\"message\\": \\"Some message\\"
                }
              }
              "
          `);
    });
  });
});
