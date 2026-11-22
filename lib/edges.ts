import fetch from '~/webext/fetch.ts';
import * as repository from '~/webext/repository.ts';

type Prefix = 'edge_';

export async function locate(codes: string[]) {
  const dict = await repository.findByIds<TwoUppercaseLetters>(
    codes.map((c) => ('edge_' satisfies Prefix) + c),
  );

  const edges: Record<string, TwoUppercaseLetters> = {};
  for (const [k, v] of Object.entries(dict)) {
    edges[k.substring(('edge_' satisfies Prefix).length)] = v;
  }

  return edges;
}

export async function refreshEdges() {
  interface Edge {
    country: TwoUppercaseLetters;
    region: string;
  }

  const dataset = await fetch<Record<string, Edge>>('datasets/edges.json');

  const map: Record<string, TwoUppercaseLetters> = {};
  for (const [k, v] of Object.entries(await dataset.json())) {
    map[('edge_' satisfies Prefix) + k] = v.country;
  }

  const obsoleteKeys = await repository
    .findByIds()
    .then((dict) =>
      Object.keys(dict).filter(
        (k) => k.startsWith('edge_' satisfies Prefix) && !Object.hasOwn(map, k),
      ),
    );

  await repository.remove(obsoleteKeys);
  await repository.upsert(map);
}
