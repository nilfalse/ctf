import path from 'node:path';

import type { OutputBundle, OutputChunk } from 'rolldown';

export function getChunk(bundle: OutputBundle, filepath: string) {
  const id = path.resolve(filepath);

  const chunk = Object.values(bundle).find(
    (file): file is OutputChunk =>
      file.type === 'chunk' && file.facadeModuleId === id,
  );

  if (!chunk) {
    throw new Error(`Cannot find entry chunk for ${filepath}`);
  }

  return chunk;
}

/**
 * The runtime chunk and popup.html may be in different directories, so calculate a browser-relative URL.
 *
 * Example:
 *
 *   - `popup/popup.html`
 *   - `popup/popup.runtime-D3x7K2.js`
 *
 * becomes:
 *
 *   - `./popup.runtime-D3x7K2.js`
 */
export function relativeAssetUrl(htmlFileName: string, assetFileName: string) {
  const htmlDirectory = path.posix.dirname(htmlFileName.replaceAll('\\', '/'));

  const assetPath = assetFileName.replaceAll('\\', '/');

  const relative = path.posix.relative(
    htmlDirectory === '.' ? '' : htmlDirectory,
    assetPath,
  );

  return relative ? relative : path.posix.basename(assetPath);
}
