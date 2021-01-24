import * as backgroundController from './controllers/background_controller';
import * as debug from './util/debug';

import './controllers';

debug.intro();

backgroundController.start();
