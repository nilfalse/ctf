import { InitCommand } from '../commands/init';
import * as mediator from '../util/mediator';

import './network_controller';
import './tab_controller';
import './xpc_controller';

import './storage_controller';
import './action_controller';

export function start() {
  return mediator.publish(new InitCommand());
}
