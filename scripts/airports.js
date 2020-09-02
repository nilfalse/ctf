'use strict';

/* eslint-disable camelcase */
const fs = require('fs');

const csv = require('csv-stream');
const fetch = require('node-fetch');

async function main([outputFilePath]) {
  const url = 'https://datahub.io/core/airport-codes/datapackage.json';

  const datasetResponse = await fetch(url);
  if (datasetResponse.headers.get('Content-Type') !== 'application/json') {
    console.error(await datasetResponse.text());
    process.exit(1);
  }

  const dataset = await datasetResponse.json();
  const resource = dataset.resources.find((r) => r.format === 'csv');

  const codes = {};
  const extraCodes = {};

  function filterAirports(airport) {
    if (!airport.iata_code || !airport.type.endsWith('airport')) {
      return;
    }

    const { iata_code, iso_country, iso_region } = airport;

    const skipRules = {
      [`Skipping duplicate IAIA ${iata_code}`]: () =>
        Object.prototype.hasOwnProperty.call(codes, iata_code) ||
        Object.prototype.hasOwnProperty.call(extraCodes, iata_code),

      [`Skipping invalid IAIA ${iata_code}`]: () =>
        !/[A-Z]+/.test(iata_code) || /[^A-Z0-9]+/.test(iata_code),

      [`Skipping IAIA ${iata_code} because country ${iso_country} is not in region ${iso_region}`]: () =>
        iso_country.toUpperCase() === 'NA' &&
        iso_region.substring(0, 2).toUpperCase() === 'US',
    };

    for (const [reason, rule] of Object.entries(skipRules)) {
      if (rule()) {
        console.error(reason);

        return;
      }
    }

    const item = {
      continent: /\d+/.test(airport.continent) ? undefined : airport.continent,
      iso_country,
      // type: airport.type,
      iso_region,
    };

    if (iata_code.length === 3) {
      codes[iata_code] = item;
    } else {
      extraCodes[iata_code] = item;

      console.error(`${iata_code} will be appended at the end of the file`);
    }
  }

  (await fetch(resource.path)).body
    .pipe(csv.createStream())
    .on('data', filterAirports)
    .on('end', () => {
      fs.writeFileSync(
        outputFilePath,
        JSON.stringify({ ...codes, ...extraCodes }),
        'utf-8'
      );
    })
    .on('error', (err) => {
      console.error(err);
      process.exit(1);
    });
}

main(process.argv.slice(2));
