import * as country from '~/lib/country.ts';
import * as svg from '~/lib/svg.ts';
import type { Path } from '~/webext/action/index.ts';
import * as prefs from '~/webext/prefs.ts';

import { baseHost } from '../webext/fetch/const.ts' with { type: 'macro' };

type Icons = 'native' | 'twemoji';

export async function flag(iso: TwoUppercaseLetters): Promise<Path> {
  const { icons = 'twemoji' } = await prefs.preferred<Icons>(['icons']);

  if (icons === 'native') {
    return { path: svg.toDataURL(svg.char(country.emoji(iso))) };
  }

  return { path: `${baseHost}assets/twemoji/${iso}.svg` };
}
