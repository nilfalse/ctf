'use strict';

const assert = require('assert');
const fs = require('fs').promises;
const path = require('path');

const stringify = require('fast-stable-stringify');
const prettier = require('prettier');

const LOCALES = ['en'];

function main() {
  const localesRoot = path.resolve(__dirname, '..', 'bundle', '_locales');

  const files = LOCALES.map(function (locale) {
    assertIsSupportedLocale(locale);

    return [locale, path.resolve(localesRoot, locale, 'messages.json')];
  });

  return Promise.all(
    files.map(([locale, filepath]) =>
      readJSON(filepath).then(([messages, messagesContent]) => {
        const {
          countries,
        } = require(`i18n-iso-countries/langs/${locale}.json`);

        for (const [key] of Object.entries(messages)) {
          if (key.startsWith('country_name_')) {
            delete messages[key];
          }
        }

        for (const [code, nameOrNames] of Object.entries(countries)) {
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
    return country[1];
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

main(process.argv.slice(2));
