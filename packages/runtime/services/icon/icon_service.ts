import { Report } from '../../lib/report';
import * as debug from '../../util/debug';
import { twemoji } from '../emoji/emoji_service';
import * as env from '../env/env_service';
import * as preferenceService from '../preference/preference_service';
import * as renderingService from '../rendering/rendering_service';
import * as svg from '../svg/svg_service';

export type Icon = Unwrap<ReturnType<typeof getIcon>>;

export const sizes = [16, 32, 64, 128, 160] as const;

export const defaultIconPromise = createImageData((size: number) =>
  svg.toDataURI(svg.char('🏁', size))
);

export async function getIcon(
  { flag, iso }: Report,
  pref = preferenceService.getValue('render')
) {
  switch (pref) {
    case 'twemoji': {
      const path = twemoji.getFilePath(iso);

      if (env.supportsActionSVG) {
        return { path };
      } else {
        const content = await fetch(path);
        const dataUri = svg.toDataURI(await content.text());

        return createImageData(() => dataUri);
      }
    }

    case 'emoji': {
      const dataUriFactory = (size: number) =>
        svg.toDataURI(svg.char(flag.emoji, size));

      return createImageData(dataUriFactory);
    }

    default: {
      return debug.never(
        `Unexpected preference value "${
          pref as string
        }" while rendering data URI`
      );
    }
  }
}

async function createImageData(factory: (size: number) => string) {
  const images = sizes.map((size) => ({
    size,
    dataUri: factory(size),
  }));

  return {
    imageData: await renderingService.render(images),
  };
}
