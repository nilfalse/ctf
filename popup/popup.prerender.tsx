import { StrictMode } from 'react';
import { prerender } from 'react-dom/static';
import type { ChunkMetadata } from 'vite';

import { Layout } from '../Layout.tsx';
import { relativeAssetUrl } from '../build/plugins/_util.ts';
import Popup from './Popup.tsx';

interface Props {
  output: string;
  runtimeChunk: { fileName: string; viteMetadata?: ChunkMetadata };
}

export default async function ({ output, runtimeChunk }: Props) {
  const { prelude } = await prerender(
    <StrictMode>
      <Layout
        head={runtimeChunk.viteMetadata?.importedCss?.values().map((file) => (
          <link
            key={file}
            rel="stylesheet"
            href={relativeAssetUrl(output, file)}
          />
        ))}
      >
        <Popup />
      </Layout>
    </StrictMode>,

    { bootstrapModules: [relativeAssetUrl(output, runtimeChunk.fileName)] },
  );

  return prelude;
}
