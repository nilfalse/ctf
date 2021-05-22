/* eslint-disable camelcase */
import csv from 'csv-stream';
import stringify from 'fast-stable-stringify';
import fetch from 'node-fetch';
import prettier from 'prettier';

export function main() {
  const url = 'https://ourairports.com/data/airports.csv';

  const codes = {};
  function filterAirports(airport) {
    if (!airport.iata_code || !airport.type.endsWith('airport')) {
      return;
    }

    const { iata_code, iso_country, iso_region } = airport;

    const skipRules = {
      [`Skipping duplicate IAIA ${iata_code}`]:
        Object.prototype.hasOwnProperty.call(codes, iata_code),

      [`Skipping invalid IAIA ${iata_code}`]:
        !/[A-Z]+/.test(iata_code) || /[^A-Z0-9]+/.test(iata_code),

      [`Skipping IAIA ${iata_code} because country ${iso_country} is not in region ${iso_region}`]:
        iso_country.toUpperCase() === 'NA' &&
        iso_region.substring(0, 2).toUpperCase() === 'US',
    };

    for (const [reason, condition] of Object.entries(skipRules)) {
      if (condition) {
        process.stderr.write(reason + '\n');

        return;
      }
    }

    const item = {
      continent: /\d+/.test(airport.continent) ? undefined : airport.continent,
      iso_country,
      // type: airport.type,
      iso_region,
    };

    codes[iata_code] = item;
  }

  return new Promise((resolve, reject) => {
    fetch(url).then(
      (r) =>
        r.body
          .pipe(csv.createStream({ enclosedChar: '"' }))
          .on('data', filterAirports)
          .on('end', () => {
            const output = prettier.format(stringify(codes), {
              semi: false,
              parser: 'json',
            });

            resolve(output);
          })
          .on('error', reject),
      reject
    );
  });
}
