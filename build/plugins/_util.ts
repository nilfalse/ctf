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
