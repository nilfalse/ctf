import * as raster from '~/lib/raster.ts';
import { on } from '~/webext/runtime/message.ts';

import type { Intent, Outcome } from './interfaces.ts';

on('raster', function ({ url, sizes }: Intent): Promise<Outcome> {
  return raster
    .rasterize(url, sizes)
    .then((images) => images.map(({ data }) => Array.from(data)))
    .catch(String);
});
