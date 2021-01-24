import { InitCommand } from '../commands/init';
import * as mediator from '../util/mediator';

export function start() {
  mediator.publish(new InitCommand());
}
