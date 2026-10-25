import * as country from '~/lib/country.ts';
import { prefs } from '~/lib/prefs.ts';
import * as svg from '~/lib/svg.ts';
import type { Path } from '~/webext/action/index.ts';

import { baseHost } from '../webext/fetch/const.ts' with { type: 'macro' };

export async function flag(iso: TwoUppercaseLetters): Promise<Path> {
  const { icons } = await prefs();

  switch (icons) {
    case 'native':
      return { path: svg.toDataURL(svg.char(country.emoji(iso))) };
    case 'twemoji':
      return { path: `${baseHost}assets/twemoji/${iso}.svg` };
  }
}
