import * as debug from '../debug';
import * as backgroundController from './controller';

debug.intro();

backgroundController.init({
  browser: chrome,
});
