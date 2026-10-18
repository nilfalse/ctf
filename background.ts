import * as runtime from '~/webext/runtime.ts';

runtime.onInstalled(function () {
  console.log('Capture The Flag: installed');
});
