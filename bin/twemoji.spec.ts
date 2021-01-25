import * as fs from 'fs';

import { Body } from 'node-fetch';

import * as harness from './__harness__';
import { main } from './lib/twemoji.js';

jest.mock('fs');

const COUNTRY_COUNT = 258;

describe('Twemoji Script', () => {
  const fetch = harness.fetch.stream('SVG CONTENT');
  let consoleLogSpy: jest.SpiedFunction<Console['log']>;
  let responsePipeSpy: jest.SpiedFunction<Body>;

  beforeEach(() => {
    consoleLogSpy = jest
      .spyOn(globalThis.console, 'log')
      .mockReturnValue(undefined);
    responsePipeSpy = jest
      .spyOn(fetch.response.body, 'pipe')
      .mockReturnValue(undefined);
  });

  afterEach(() => {
    responsePipeSpy.mockRestore();
    consoleLogSpy.mockRestore();
    jest.spyOn(fs, 'createWriteStream').mockReset();
  });

  describe('when downloading', () => {
    it('should fetch each country', async () => {
      await expect(main('/home/fake/root/bin')).resolves.toHaveLength(
        COUNTRY_COUNT
      );
    });

    it('should fetch from CDN', async () => {
      await main('/home/fake/root/bin');

      expect(fetch.mock).toHaveBeenCalledWith(
        'https://twemoji.maxcdn.com/v/latest/svg/1f1e9-1f1f0.svg',
        expect.any(Object)
      );
    });

    it('should persist each flag', async () => {
      await main('/home/fake/root/bin');

      expect(responsePipeSpy).toHaveBeenCalledTimes(COUNTRY_COUNT);
      expect(fs.createWriteStream).toHaveBeenCalledTimes(COUNTRY_COUNT);
    });

    it('should store flags in the designated directory', async () => {
      await main('/home/fake/root/bin');

      expect(fs.createWriteStream).toHaveBeenCalledWith(
        '/home/fake/root/bundle/assets/twemoji/dk.svg'
      );
    });
  });

  describe('when any response is not OK', () => {
    beforeEach(() => {
      jest.spyOn(console, 'error').mockReturnValue(undefined);
      jest.spyOn(process, 'exit').mockReturnValue(undefined as never);
      jest.spyOn(fetch.response, 'ok', 'get').mockReturnValue(false);
    });

    afterEach(() => {
      jest.spyOn(console, 'error').mockRestore();
      jest.spyOn(process, 'exit').mockRestore();
    });

    it('should log the error to stderr', async () => {
      jest
        .spyOn(fetch.response, 'statusText', 'get')
        .mockReturnValue('Expectation Failed');
      jest.spyOn(fetch.response, 'status', 'get').mockReturnValue(417);

      await main('/home/fake/root/bin');

      const spy = jest.spyOn(console, 'error');
      expect(spy).toHaveBeenCalledWith(expect.any(Error));
      expect(spy.mock.calls[0][0]).toHaveProperty(
        'message',
        '417 Expectation Failed'
      );
    });

    it('should log headers of the failed response', async () => {
      jest.spyOn(fetch.response, 'headers', 'get').mockReturnValue({
        forEach: jest.fn().mockImplementation((logger) => {
          logger('lol/boom', 'Content-Type');
        }),
      });

      await main('/home/fake/root/bin');

      expect(consoleLogSpy).toHaveBeenCalledWith('  Content-Type: lol/boom');
    });

    it('should terminate the process with a failure code', async () => {
      await main('/home/fake/root/bin');

      expect(process.exit).toHaveBeenCalledWith(1);
    });
  });
});
