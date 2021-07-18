import csvStream from 'csv-stream';

import * as harness from './__harness__';
import { main } from './airports.js';

describe('Airports Script', () => {
  describe('download', () => {
    const fetch = harness.fetch.stream(harness.csv.airports());

    it('should fetch data from ourairports.com', () => {
      const ignoredPromise = main();

      expect(fetch.mock).toHaveBeenCalledWith(
        'https://ourairports.com/data/airports.csv'
      );
    });

    it('should respect double quotes in input', async () => {
      const spy = jest.spyOn(csvStream, 'createStream');

      const mainTyped = main as () => Promise<void>;
      const ignoredResult = await mainTyped();

      expect(spy).toHaveBeenCalledWith({ enclosedChar: '"' });
    });
  });

  describe('filtering', () => {
    describe('non-airports', () => {
      harness.fetch.stream(
        harness.csv.airports(
          ['"heliport","NA","US","US-VA","HELIPORT"'],
          ['cph']
        )
      );

      it('should skip', () => expect(main()).resolves.toMatchSnapshot());
    });

    describe('duplicate airports', () => {
      harness.fetch.stream(harness.csv.airports(['cph', 'cph']));

      it('should skip', () => expect(main()).resolves.toMatchSnapshot());
    });

    describe('invalid IATA', () => {
      harness.fetch.stream(
        harness.csv.airports(
          [
            '"small_airport","NA","US","US-LA",',
            '"small_airport","EU","DK","DK-85","-"',
          ],
          ['cph']
        )
      );

      it('should skip', () => expect(main()).resolves.toMatchSnapshot());
    });

    describe('country-specific', () => {
      harness.fetch.stream(
        harness.csv.airports(
          ['"small_airport","","NA","US-LA","NAIATA"'],
          ['cph']
        )
      );

      it('should skip', () => expect(main()).resolves.toMatchSnapshot());
    });

    describe('with numeric continent', () => {
      harness.fetch.stream(
        harness.csv.airports(
          ['"small_airport","123","US","US-LA","NUMERIC"'],
          ['cph']
        )
      );

      it('should keep the record w/o continent', () =>
        expect(main()).resolves.toMatchSnapshot());
    });
  });

  describe('output', () => {
    const csv = harness.csv.airports(['cph', 'iev', 'kbp']);

    describe('when input is sorted alphabetically', () => {
      harness.fetch.stream(csv);

      it('should output in the same order', () =>
        expect(main()).resolves.toMatchSnapshot());
    });

    describe('when input is unsorted', () => {
      const csvUnsorted = harness.csv.airports(['iev', 'cph', 'kbp']);
      harness.fetch.stream(csvUnsorted);

      it('should output sorted', () =>
        expect(main()).resolves.toMatchSnapshot());
    });

    describe('formatting', () => {
      harness.fetch.stream(csv);

      it('should pretty-print', () =>
        expect(main()).resolves.toMatchSnapshot());
    });
  });
});
