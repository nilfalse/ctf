import * as raster from '../raster/raster_service';

type RenderingInput = ReadonlyArray<{
  size: number;
  dataUri: string;
}>;

export interface RenderingOutput {
  [size: number]: ImageData;
}

export async function render(images: RenderingInput) {
  const renders = await Promise.all(
    images.map(({ dataUri, size }) => raster.toImageData(dataUri, size))
  );

  return renders.reduce<RenderingOutput>((dict, img, idx) => {
    const { size } = images[idx];
    dict[size] = img;

    return dict;
  }, {});
}
