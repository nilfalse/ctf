import * as airports from '~/lib/airports.ts';
import * as q from '~/lib/q.ts';
import * as runtime from '~/webext/runtime.ts';

// Install isn't tied to a tab; -1 matches `tabs.TAB_ID_NONE`.
const NO_TAB = -1;

runtime.onInstalled(function () {
  q.enqueue(NO_TAB, async function () {
    console.log('Capture The Flag: installed');

    await airports.populate();
  });
});
