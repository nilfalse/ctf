import * as raster from '../raster/raster_service';
import * as svg from '../svg/svg_service';

import { render } from './rendering_service';

jest.mock('../raster/raster_service');
jest.mock('../svg/svg_service');

describe('Rendering subsystem', () => {
  const emoji = '🇩🇰';

  const contentSpy = jest.spyOn(svg, 'content');
  const toDataURISpy = jest.spyOn(svg, 'toDataURI');
  const toImageDataSpy = jest.spyOn(raster, 'toImageData');

  afterEach(() => {
    contentSpy.mockReset();
    toDataURISpy.mockReset();
    toImageDataSpy.mockReset();
  });

  it('should create data URI with SVG content', async () => {
    contentSpy.mockReturnValue('<svg />');
    await render(emoji);

    expect(svg.toDataURI).toHaveBeenCalledWith('<svg />');
    expect(svg.toDataURI).toHaveBeenCalledTimes(5);
  });

  it('should raster the data URI', async () => {
    toDataURISpy.mockReturnValue('data:image/svg+xml;base64,');
    await render(emoji);

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
    const result = await render(emoji);

    expect(result).toHaveProperty('16');
    expect(result).toHaveProperty('32');
    expect(result).toHaveProperty('64');
    expect(result).toHaveProperty('128');
    expect(result).toHaveProperty('160');
  });
});
