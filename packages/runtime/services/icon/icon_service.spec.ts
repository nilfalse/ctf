import * as harness from '../../__test__/harness';
import { Report } from '../../lib/report';
import * as raster from '../raster/raster_service';
import * as svg from '../svg/svg_service';

import { getIcon } from './icon_service';

jest.mock('../raster/raster_service');
jest.mock('../svg/svg_service');

describe('Icon service', () => {
  const report = {
    iso: 'DK',
    flag: { emoji: '🇩🇰' },
  } as Report;

  const contentSpy = jest.spyOn(svg, 'char');
  const toDataURISpy = jest.spyOn(svg, 'toDataURI');
  const toImageDataSpy = jest.spyOn(raster, 'toImageData');

  harness.fetch.stream('');

  afterEach(() => {
    contentSpy.mockReset();
    toDataURISpy.mockReset();
    toImageDataSpy.mockReset();
  });

  it('should create data URI with SVG content', async () => {
    toDataURISpy.mockReset();
    contentSpy.mockReturnValue('<svg />');

    await getIcon(report, 'emoji');

    expect(svg.toDataURI).toHaveBeenCalledWith('<svg />');
    expect(svg.toDataURI).toHaveBeenCalledTimes(5);
  });

  it('should raster the data URI', async () => {
    toDataURISpy.mockReturnValue('data:image/svg+xml;base64,');
    await getIcon(report);

    expect(raster.toImageData).toHaveBeenCalledWith(
      'data:image/svg+xml;base64,',
      16
    );
    expect(raster.toImageData).toHaveBeenCalledWith(
      'data:image/svg+xml;base64,',
      32
    );
  });

  it('should produce all sizes at once', async () => {
    const result = (await getIcon(report)) as {
      imageData: {
        [size: number]: ImageData;
      };
    };

    expect(result.imageData).toHaveProperty('16');
    expect(result.imageData).toHaveProperty('32');
    expect(result.imageData).toHaveProperty('64');
    expect(result.imageData).toHaveProperty('128');
    expect(result.imageData).toHaveProperty('160');
  });
});
