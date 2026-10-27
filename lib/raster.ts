import * as canvas from './canvas.ts';

export async function rasterize(url: string, sizes: number[]) {
  const image = new Image();
  image.crossOrigin = 'anonymous'; // the CDN allows it, so the canvas stays readable
  image.src = url;
  await image.decode();

  return sizes.map(canvas.toImageData(image));
}
