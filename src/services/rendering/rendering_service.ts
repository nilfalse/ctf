import { Report } from '../../lib/report';
import * as debug from '../../util/debug';
import { twemoji } from '../emoji/emoji_service';
import * as preferenceService from '../preference/preference_service';
import * as raster from '../raster/raster_service';
import * as svg from '../svg/svg_service';

export const sizes = [16, 32, 64, 128, 160] as const;

type Size = typeof sizes;

export type RenderingResult = {
  [key in ArrayElementType<Size>]: ImageData;
};

export async function render(
  report: Report,
  pref = preferenceService.getValue('render')
) {
  const images = await createDataURI(report, pref);

  const renders = await Promise.all(
    images.map(({ size, dataUri }) => {
      return raster.toImageData(dataUri, size);
    })
  );

  return renders.reduce((dict, img, idx) => {
    const size = sizes[idx];
    dict[size] = img;

    return dict;
  }, {} as RenderingResult);
}

async function createDataURI({ flag, iso }: Report, pref: string) {
  switch (pref) {
    case 'emoji': {
      return emojiFactory(flag.emoji);
    }
    case 'twemoji': {
      return twemojiFactory(iso);
    }
    default: {
      debug.assert(
        true,
        `Unexpected preference value "${pref}" while rendering data URI`
      );
      break;
    }
  }
}

function emojiFactory(emoji: string) {
  return sizes.map((size) => ({
    size,
    dataUri: svg.toDataURI(svg.content(emoji, size)),
  }));
}

async function twemojiFactory(countryCode: string) {
  const content = await fetch(twemoji.getFilePath(countryCode));
  const dataUri = svg.toDataURI(await content.text());

  return sizes.map((size) => ({
    size,
    dataUri,
  }));
}
