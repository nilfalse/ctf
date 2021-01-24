import * as raster from '../raster/raster_service';
import * as svg from '../svg/svg_service';

export const sizes = [16, 32, 64, 128, 160] as const;

type Size = typeof sizes;

type ElementType<T extends ReadonlyArray<unknown>> = T extends ReadonlyArray<
  infer ElementType
>
  ? ElementType
  : never;

export type RenderingResult = {
  [key in ElementType<Size>]: ImageData;
};

export async function render(emoji: string) {
  const images = await Promise.all(
    sizes.map((size) => {
      const dataUri = svg.toDataURI(svg.content(emoji, size));

      return raster.toImageData(dataUri, size);
    })
  );

  return images.reduce((dict, img, idx) => {
    const size = sizes[idx];
    dict[size] = img;

    return dict;
  }, {} as RenderingResult);
}
