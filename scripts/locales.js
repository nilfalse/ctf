import assert from 'assert';
import { promises as fs } from 'fs';
import path from 'path';

import stringify from 'fast-stable-stringify';
import prettier from 'prettier';

const LOCALES = ['en'];

function main(__dirname) {
  const localesRoot = path.resolve(__dirname, '..', 'bundle', '_locales');

  const files = LOCALES.map(function (locale) {
    assertIsSupportedLocale(locale);

    return [locale, path.resolve(localesRoot, locale, 'messages.json')];
  });

  return Promise.all(
    files.map(([locale, filepath]) =>
      readJSON(filepath).then(async ([messages, messagesContent]) => {
        const { default: lang } = await import(
          `i18n-iso-countries/langs/${locale}.json`
        );

        for (const [key] of Object.entries(messages)) {
          if (key.startsWith('country_name_')) {
            delete messages[key];
          }
        }

        for (const [code, nameOrNames] of Object.entries(lang.countries)) {
          messages['country_name_' + code] = {
            message: extractCountryName(nameOrNames, { code }),
          };
        }

        const messagesPretty = print(messages);

        if (messagesContent !== messagesPretty) {
          return saveJSON(filepath, messagesPretty);
        }
      })
    )
  );
}

function extractCountryName(country, { code }) {
  if (Array.isArray(country)) {
    return country[0];
  }

  const split = country.split(',').map((s) => s.trim());
  if (split.length > 1) {
    switch (code) {
      case 'VI':
      case 'VG':
        // Virgin Islands -- British / U.S.
        return `${split[1]} ${split[0]}`;
      default:
        return split[0];
    }
  }

  return country;
}

function print(json) {
  return prettier.format(stringify(json), {
    semi: false,
    parser: 'json-stringify',
  });
}

async function readJSON(filepath) {
  const content = await fs.readFile(filepath, 'utf-8');

  return [JSON.parse(content), content];
}

function saveJSON(filepath, content) {
  return fs.writeFile(filepath, content, 'utf-8');
}

function assertIsSupportedLocale(locale) {
  assert(locale.length === 2);
}

async function getDirname() {
  const url = await import('url');

  return path.dirname(url.fileURLToPath(import.meta.url));
}

getDirname().then(main);
