import { prefs } from '~/lib/prefs.ts';

export async function migrate() {
  await prefs().then((p) => p.migrate());
}
