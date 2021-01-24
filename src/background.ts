import * as backgroundController from './controllers/background_controller';
import * as debug from './util/debug';

import './controllers/network_controller';
import './controllers/tab_controller';
import './controllers/xpc_controller';

debug.intro();

backgroundController.start();
