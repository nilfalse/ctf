import * as webVitals from 'web-vitals';

import { reportWebVitals } from './report-web-vitals';

jest.mock('web-vitals');

describe('Landing Page Web Vitals', () => {
  describe('when invoked without callback', () => {
    it('should not report', () => {
      reportWebVitals();

      expect(webVitals.getTTFB).not.toHaveBeenCalled();
    });
  });

  describe('when invoked with a callback', () => {
    it('should report "time to first byte"', async () => {
      let done: (value: unknown) => void;
      const resultPromise = new Promise((resolve) => {
        done = resolve;
      });

      const callback = jest.fn();
      jest.spyOn(webVitals, 'getTTFB').mockImplementation((_onReport) => {
        done(null);
      });
      reportWebVitals(callback);

      await resultPromise;
      expect(webVitals.getTTFB).toHaveBeenCalledTimes(1);
    });
  });
});
