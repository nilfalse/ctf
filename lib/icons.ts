import * as country from '~/lib/country.ts';
import { prefs } from '~/lib/prefs.ts';
import * as svg from '~/lib/svg.ts';
import * as offscreen from '~/offscreen/offscreen.api.ts';
import type { IconData, Path } from '~/webext/action/index.ts';

import { BASE_URL } from '../const.ts' with { type: 'macro' };

const _SIZES = [64, 32, 16];

export async function flag(iso: TwoUppercaseLetters): Promise<Path | IconData> {
  const { icons } = await prefs();

  let url: string;
  switch (icons) {
    case 'native':
      url = svg.toDataURL(svg.char(country.emoji(iso)));
      break;
    case 'twemoji':
      url = `${BASE_URL}assets/twemoji/${iso}.svg`;
      break;
  }

  return import.meta.env.FEATURE_TOOLBAR_SVG !== ''
    ? { path: url }
    : { imageData: await offscreen.rasterize(url, _SIZES) };
}
