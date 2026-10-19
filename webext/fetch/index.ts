import { baseHost } from './const.ts' with { type: 'macro' };

export default async function <T>(input: string): Promise<T> {
  const response = await fetch(new URL(input, baseHost));
  if (!response.ok) {
    console.error(response);
    throw new Error('HTTP fetch failed: ' + response.url);
  }

  return response.json();
}
