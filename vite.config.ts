import type { UserConfig } from 'vite';

export default {
  input: {
    background: './background.ts',
  },
  publicDir: 'resources',
} satisfies UserConfig;
