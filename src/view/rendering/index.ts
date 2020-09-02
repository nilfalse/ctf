import * as raster from './raster';
import * as svg from './svg';

export const sizes = [16, 32, 64, 128, 160] as const;

type Size = typeof sizes;

type ElementType<T extends ReadonlyArray<unknown>> = T extends ReadonlyArray<
  infer ElementType
>
  ? ElementType
  : never;

type RenderingResult = {
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
