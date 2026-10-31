import { awaitOffscreen } from '~/webext/offscreen/-chromium.ts';
import { sendMessage } from '~/webext/runtime/message.ts';

import type { Intent, Outcome } from './interfaces.ts';

export async function rasterize(url: string, sizes: number[]) {
  await awaitOffscreen();

  const pixels = await sendMessage<Intent, Outcome>({
    target: 'raster',
    url,
    sizes,
  });
  if (typeof pixels === 'string') {
    throw new Error(pixels);
  }

  return Object.fromEntries(
    sizes.map((size, i) => [
      size,
      new ImageData(new Uint8ClampedArray(pixels[i]), size),
    ]),
  );
}
