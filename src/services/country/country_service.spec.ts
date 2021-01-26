import * as harness from '../../__test__/harness';

import * as countryService from './country_service';

describe('Country service', () => {
  harness.browser.i18n();

  it('should get country name for DK', () => {
    expect(countryService.getName('DK')).toBe('Denmark');
  });

  it('should get country name for UA', () => {
    expect(countryService.getName('UA')).toBe('Ukraine');
  });

  it('should get country name given mixed case "Ua"', () => {
    expect(countryService.getName('Ua')).toBe('Ukraine');
  });
});
