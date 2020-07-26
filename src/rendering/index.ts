import * as svg from './svg';
import * as raster from './raster';

type ElementType<T extends ReadonlyArray<unknown>> = T extends ReadonlyArray<
  infer ElementType
>
  ? ElementType
  : never;

type RenderingResult = {
  [key in ElementType<Size>]: ImageData;
};

type Size = typeof sizes;

export const sizes = [16, 32, 64, 128, 160] as const;

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
