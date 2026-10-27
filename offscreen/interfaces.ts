import type * as runtime from '~/webext/runtime/message.ts';

export interface Intent extends runtime.Intent {
  target: 'raster';
  url: string;
  sizes: number[];
}

// ImageData doesn't survive the JSON of runtime messaging, so the pixels
// travel as arrays, one per size in order. A failed render answers its error.
export type Outcome = number[][] | string;
