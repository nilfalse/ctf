import { BASE_URL, FETCH_TIMEOUT } from '../const.ts' with { type: 'macro' };

interface HttpResponse<T> extends Response {
  json(): Promise<T>;
}

export default async function <R>(input: string) {
  const response: HttpResponse<R> = await fetch(new URL(input, BASE_URL), {
    signal: AbortSignal.timeout(FETCH_TIMEOUT),
  });

  if (!response.ok) {
    console.error(response);
    throw new Error('HTTP fetch failed: ' + response.url);
  }

  return response;
}
